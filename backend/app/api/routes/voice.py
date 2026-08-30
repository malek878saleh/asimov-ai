from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from pydantic import BaseModel
from app.core.voice.tts import TextToSpeech
from app.core.voice.stt import SpeechToText
import tempfile
import os

router = APIRouter()
tts = TextToSpeech()
stt = SpeechToText()

class TTSRequest(BaseModel):
    text: str
    voice_id: str = "default"

@router.post("/tts")
async def text_to_speech(request: TTSRequest):
    try:
        audio_path = await tts.generate_speech(request.text, request.voice_id)
        return FileResponse(audio_path, media_type="audio/wav")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stt")
async def speech_to_text(audio: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            content = await audio.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        text = await stt.transcribe(tmp_path)
        os.unlink(tmp_path)
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))