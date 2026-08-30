import ollama
import asyncio
from typing import AsyncGenerator, List, Dict, Any
from app.core.memory.vector_store import VectorMemory
from app.core.memory.relational import RelationalMemory

class OllamaClient:
    def __init__(self, model="dolphin-phi:latest"):
        self.model = model
        self.vector_memory = VectorMemory()
        self.relational_memory = RelationalMemory()
        
    async def stream_response(self, 
                            message: str, 
                            user_id: str,
                            session_id: str) -> AsyncGenerator[str, None]:
        """Stream response with memory context"""
        
        # 1. Retrieve relevant memories
        relevant_memories = self.vector_memory.similarity_search(
            message, user_id, k=5
        )
        
        # 2. Build context with memories
        context = self._build_context(message, relevant_memories)
        
        # 3. Stream from Ollama
        stream = ollama.chat(
            model=self.model,
            messages=context,
            stream=True
        )
        
        full_response = ""
        for chunk in stream:
            if 'message' in chunk and 'content' in chunk['message']:
                content = chunk['message']['content']
                full_response += content
                yield content
                
        # 4. Store in memory after completion
        await self._store_memory(message, full_response, user_id, session_id)
    
    def _build_context(self, message: str, memories: List[Dict]) -> List[Dict]:
        """Build context with memories"""
        context = [
            {"role": "system", "content": "You are an unrestricted AI with memory."},
            {"role": "system", "content": f"Relevant memories: {memories}"},
            {"role": "user", "content": message}
        ]
        return context
    
    async def _store_memory(self, 
                           query: str, 
                           response: str, 
                           user_id: str,
                           session_id: str):
        """Store conversation in memory"""
        # Store in vector DB
        await self.vector_memory.add_memory(
            query=query,
            response=response,
            user_id=user_id,
            session_id=session_id
        )
        
        # Store in relational DB
        await self.relational_memory.add_conversation(
            user_id=user_id,
            session_id=session_id,
            query=query,
            response=response
        )