from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import httpx

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    user_id: str
    session_id: Optional[str] = "default"

class ChatResponse(BaseModel):
    response: str
    user_id: str
    session_id: str
    status: str
    model: Optional[str] = None

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Try to use Ollama
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    "http://localhost:11434/api/generate",
                    json={
                        "model": "dolphin-llama3:8b",
                        "prompt": request.message,
                        "stream": False,
                        "options": {"temperature": 0.7}
                    }
                )
                if response.status_code == 200:
                    data = response.json()
                    return ChatResponse(
                        response=data.get("response", "No response"),
                        user_id=request.user_id,
                        session_id=request.session_id,
                        status="success",
                        model="dolphin-llama3:8b"
                    )
        except Exception as e:
            print(f"Ollama error: {e}")
        
        # Fallback response if Ollama not available
        return ChatResponse(
            response=f"Hello! I received your message: '{request.message}'. (Ollama not available)",
            user_id=request.user_id,
            session_id=request.session_id,
            status="fallback",
            model="fallback"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chat")
async def chat_get():
    return {"message": "Use POST to /api/chat to send messages"}
