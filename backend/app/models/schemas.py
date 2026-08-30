from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ChatRequest(BaseModel):
    message: str
    user_id: str
    session_id: str

class ChatResponse(BaseModel):
    response: str
    user_id: str
    session_id: str
    timestamp: datetime = datetime.utcnow()

class MemorySearch(BaseModel):
    query: str
    user_id: str
    limit: int = 5