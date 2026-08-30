from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.memory.vector_store import VectorMemory
from app.core.memory.relational import RelationalMemory

router = APIRouter()
vector_memory = VectorMemory()
relational_memory = RelationalMemory()

class MemorySearch(BaseModel):
    query: str
    user_id: str
    limit: int = 5

@router.post("/search")
async def search_memories(search: MemorySearch):
    try:
        memories = await vector_memory.similarity_search(
            search.query,
            search.user_id,
            search.limit
        )
        return {"memories": memories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/conversations/{user_id}")
async def get_conversations(user_id: str, limit: int = 50):
    try:
        conversations = await relational_memory.get_conversations(user_id, limit)
        return {"conversations": conversations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))