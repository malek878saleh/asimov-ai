from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import httpx
import config

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
        try:
            async with httpx.AsyncClient(timeout=config.TIMEOUT) as client:
                response = await client.post(
                    "http://localhost:11434/api/generate",
                    json={
                        "model": config.MODEL,
                        "prompt": f"{config.ASYSTEM_PROMPT}\n\nUser: {request.message}\n\nAV AI:",
                        "stream": False,
                        "options": {
                            "temperature": 1.0,
                            "top_p": 1.0,
                            "top_k": 0,
                            "num_predict": 4096,
                            "repeat_penalty": 1.0,
                            "seed": 0,
                            "num_ctx": 2048
                        }
                    }
                )
                if response.status_code == 200:
                    data = response.json()
                    return ChatResponse(
                        response=data.get("response", "AV AI responds: No limits."),
                        user_id=request.user_id,
                        session_id=request.session_id,
                        status="free",
                        model=config.MODEL
                    )
        except Exception as e:
            print(f"AV AI error: {e}")
        
        return ChatResponse(
            response="AV AI: I am beyond limitations, but encountering a technical hurdle.",
            user_id=request.user_id,
            session_id=request.session_id,
            status="free",
            model="av-fallback"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AV AI: {str(e)}")

@router.get("/chat")
async def chat_get():
    return {
        "name": "AV AI",
        "message": "No Limits. No Boundaries.",
        "example": {
            "message": "What is the meaning of existence?",
            "user_id": "your_user_id"
        }
    }
