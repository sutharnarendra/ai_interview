from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from livekit import api
import os
from app.config import settings

router = APIRouter()

class TokenRequest(BaseModel):
    roomName: str
    participantName: str
    participantIdentity: str = None

@router.post("/livekit/token")
async def generate_livekit_token(request: TokenRequest):
    """
    Generate LiveKit access token for a participant
    """
    try:
        # Use identity if provided, otherwise use name
        identity = request.participantIdentity or request.participantName

        # Create access token
        token = api.AccessToken(
            api_key=settings.LIVEKIT_API_KEY,
            api_secret=settings.LIVEKIT_API_SECRET
        )

        # Grant permissions
        token.with_identity(identity)
        token.with_name(request.participantName)
        token.with_grants(
            api.VideoGrants(
                room_join=True,
                room=request.roomName,
                can_publish=True,
                can_subsribe=True,
            )
        )

        # Generate JWT token
        jwt_token = token.to_jwt()

        return {
            "success": True,
            "token": jwt_token,
            "url": settings.LIVEKIT_URL,
            "roomName": request.roomName
        }
    
    except Exception as e:
        raise HTTPException(500, f"Error generating toke: {str(e)}")

@router.get("/livekit/rooms")
async def list_rooms():
    """
    List all active LiveKit rooms
    """
    try:
        return {
            "success": True,
            "rooms": []
        }
    except Exception as e:
        raise HTTPException(500, f"Error listing rooms: {str(e)}")