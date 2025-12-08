"""
Google Text-to-Speech Handler (FREE alternative to Edge-TTS)
"""

from gtts import gTTS
import io

class GTTSHandler:
    def __init__(self):
        self.lang = 'en'
        self.tld = 'com'  # Can be 'com', 'co.uk', 'com.au', etc.
        
    async def text_to_speech(self, text: str) -> bytes:
        """
        Convert text to speech audio (async compatible)
        """
        try:
            # Create TTS object
            tts = gTTS(text=text, lang=self.lang, slow=False, tld=self.tld)
            
            # Save to BytesIO
            audio_buffer = io.BytesIO()
            tts.write_to_fp(audio_buffer)
            audio_buffer.seek(0)
            
            return audio_buffer.read()
            
        except Exception as e:
            print(f"Error generating speech with gTTS: {e}")
            # Return empty audio
            return b""

# Global instance
tts_handler = GTTSHandler()