"""
Deepgram Speech-to-Text Handler (SDK v5.x)
Compatible with WebM/Opus browser recordings
"""

from deepgram import DeepgramClient
from app.config import settings


class DeepgramSTTHandler:
    def __init__(self):
        self.client = DeepgramClient(api_key=settings.DEEPGRAM_API_KEY)

    def transcribe_audio_sync(self, audio_data: bytes) -> str:
        """
        Transcribe audio using Deepgram API (v5.x)
        """
        try:
            if not audio_data or len(audio_data) < 5000:
                print("Audio is too small.")
                return ""

            print("Sending audio to Deepgram (SDK v5)... Size:", len(audio_data))

            # Deepgram v5 prerecorded transcription
            response = self.client.speech.prerecorded(
                source={"buffer": audio_data, "mimetype": "audio/webm"},
                options={
                    "model": "nova-2",
                    "smart_format": True,
                    "language": "en",
                    "punctuate": True,
                    "detect_language": False,
                    "encoding": "opus",   # 🔥 Required for browser WebM recordings
                }
            )

            # Extract transcript
            transcript = response["results"]["channels"][0]["alternatives"][0]["transcript"]

            if not transcript or not transcript.strip():
                print("Deepgram returned EMPTY transcript (SDK v5).")
                return ""

            print("Deepgram transcript:", transcript)
            return transcript.strip()

        except Exception as e:
            print("Deepgram SDK v5 error:", e)
            import traceback
            traceback.print_exc()
            return ""


# Global instance
deepgram_handler = DeepgramSTTHandler()
