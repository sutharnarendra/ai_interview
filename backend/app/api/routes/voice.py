from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional
import json

from app.services.groq_voice_agent import groq_agent
from app.services.deepgram_handler import deepgram_handler
from app.services.tts_handler import tts_handler
from app.utils.firebase_admin import get_firestore_client

router = APIRouter()

class TextMessageRequest(BaseModel):
    interviewId: str
    message: str
    interviewContext: dict

@router.post("/voice/process-audio")
async def process_audio(
    interviewId: str = Form(...),
    interviewContext: str = Form(...),
    audio: UploadFile = File(...)
):
    """
    Process audio from user:
    1. Convert speech to text (Deepgram)
    2. Generate AI response (Groq)
    3. Convert response to speech (gTTS)
    4. Return audio
    """
    try:
        # Parse interview context
        context = json.loads(interviewContext)
        
        # Step 1: Speech-to-Text
        audio_data = await audio.read()
        print("Audio Size:", len(audio_data))
        print("Audio Content-Type:", audio.content_type)
        print("First 30 bytes:", audio_data[:30])

        
        print(f"Received audio: {len(audio_data)} bytes, content type: {audio.content_type}")
        
        # Check if audio data is valid
        if len(audio_data) < 1000:  # Less than 1KB is probably empty
            raise HTTPException(400, "Audio file is too small. Please speak for at least 2 seconds.")
        
        user_text = deepgram_handler.transcribe_audio_sync(audio_data)
        
        if not user_text or len(user_text.strip()) == 0:
            raise HTTPException(400, "Could not transcribe audio. Please speak clearly and try again.")
        
        print(f"✅ User said: {user_text}")
        
        # Step 2: Generate AI response
        ai_response = groq_agent.get_next_response(user_text, context)
        print(f"✅ AI responds: {ai_response}")
        
        # Step 3: Text-to-Speech
        response_audio = await tts_handler.text_to_speech(ai_response)
        
        if len(response_audio) == 0:
            print("⚠️ Warning: TTS returned empty audio")
            # Return text response even if audio fails
            return Response(
                content=b"",
                media_type="audio/mpeg",
                headers={
                    "X-Transcript-User": user_text,
                    "X-Transcript-AI": ai_response,
                    "X-Audio-Error": "TTS failed, text only"
                }
            )
        
        print(f"✅ Generated audio: {len(response_audio)} bytes")
        
        # Step 4: Store transcript in Firestore
        db = get_firestore_client()
        if db:
            try:
                from datetime import datetime
                from google.cloud import firestore as fs
                db.collection('interviews').document(interviewId).update({
                    'transcript': fs.ArrayUnion([
                        {
                            'timestamp': datetime.utcnow(),
                            'speaker': 'user',
                            'text': user_text
                        },
                        {
                            'timestamp': datetime.utcnow(),
                            'speaker': 'ai',
                            'text': ai_response
                        }
                    ])
                })
            except Exception as e:
                print(f"Warning: Could not update Firestore: {e}")
        
        # Return audio response
        return Response(
            content=response_audio,
            media_type="audio/mpeg",
            headers={
                "X-Transcript-User": user_text,
                "X-Transcript-AI": ai_response
            }
        )
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"❌ Error processing audio: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(500, f"Error processing audio: {str(e)}")

@router.post("/voice/text-message")
async def process_text_message(request: TextMessageRequest):
    """
    Process text message (for testing without audio)
    """
    try:
        # Generate AI response
        ai_response = groq_agent.get_next_response(
            request.message,
            request.interviewContext
        )
        
        # Store in Firestore
        db = get_firestore_client()
        if db:
            try:
                from datetime import datetime
                db.collection('interviews').document(request.interviewId).update({
                    'transcript': firestore.ArrayUnion([
                        {
                            'timestamp': datetime.utcnow(),
                            'speaker': 'user',
                            'text': request.message
                        },
                        {
                            'timestamp': datetime.utcnow(),
                            'speaker': 'ai',
                            'text': ai_response
                        }
                    ])
                })
            except Exception as e:
                print(f"Warning: Could not update Firestore: {e}")
        
        return {
            "success": True,
            "userMessage": request.message,
            "aiResponse": ai_response,
            "currentRound": groq_agent.current_round
        }
        
    except Exception as e:
        raise HTTPException(500, f"Error processing message: {str(e)}")

@router.post("/voice/initial-greeting")
async def get_initial_greeting(request: dict):
    """
    Get AI's initial greeting when interview starts
    """
    try:
        interview_context = request.get('interviewContext', {})
        
        # Reset agent for new interview
        groq_agent.reset_conversation()
        
        # Get greeting
        greeting = groq_agent.get_initial_greeting(interview_context)
        
        # Convert to speech
        greeting_audio = await tts_handler.text_to_speech(greeting)
        
        return Response(
            content=greeting_audio,
            media_type="audio/mpeg",
            headers={
                "X-Greeting-Text": greeting
            }
        )
        
    except Exception as e:
        raise HTTPException(500, f"Error generating greeting: {str(e)}")