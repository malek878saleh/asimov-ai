from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.ai.ollama_client import OllamaClient

router = APIRouter()
ollama_client = OllamaClient()

class ChatRequest(BaseModel):
    message: str
    user_id: str
    session_id: str

@router.post("")
async def chat(request: ChatRequest):
    try:
        response = await ollama_client.get_response(
            request.message,
            request.user_id,
            request.session_id
        )
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))