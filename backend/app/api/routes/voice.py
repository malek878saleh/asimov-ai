from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class TTSRequest(BaseModel):
    text: str
    voice: str = "default"

@router.post("/voice/tts")
async def text_to_speech(request: TTSRequest):
    return {
        "text": request.text,
        "voice": request.voice,
        "audio_url": "mock_audio.mp3",
        "status": "generated"
    }

@router.post("/voice/stt")
async def speech_to_text(audio_data: dict):
    return {
        "text": "Mock transcription",
        "status": "transcribed"
    }
