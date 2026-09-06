from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class MemorySearch(BaseModel):
    query: str
    user_id: str
    limit: Optional[int] = 5

@router.post("/memory/search")
async def search_memories(search: MemorySearch):
    return {
        "memories": [],
        "query": search.query,
        "user_id": search.user_id,
        "limit": search.limit
    }

@router.get("/memory/conversations/{user_id}")
async def get_conversations(user_id: str, limit: int = 50):
    return {
        "user_id": user_id,
        "conversations": [],
        "limit": limit
    }
