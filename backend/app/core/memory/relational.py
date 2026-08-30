import asyncpg
from typing import List, Dict, Optional

class RelationalMemory:
    def __init__(self):
        self.pool = None
    
    async def init_db(self):
        if not self.pool:
            self.pool = await asyncpg.create_pool(
                user='aiuser', password='aipassword', database='aimemory', host='postgres', port=5432
            )
            async with self.pool.acquire() as conn:
                await conn.execute('''
                    CREATE TABLE IF NOT EXISTS conversations (
                        id SERIAL PRIMARY KEY,
                        user_id VARCHAR(255) NOT NULL,
                        session_id VARCHAR(255) NOT NULL,
                        query TEXT NOT NULL,
                        response TEXT NOT NULL,
                        memory_id VARCHAR(255),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                ''')
    
    async def add_conversation(self, user_id: str, session_id: str, query: str, response: str, memory_id: Optional[str] = None):
        await self.init_db()
        async with self.pool.acquire() as conn:
            await conn.execute(
                'INSERT INTO conversations (user_id, session_id, query, response, memory_id) VALUES ($1, $2, $3, $4, $5)',
                user_id, session_id, query, response, memory_id
            )
    
    async def get_conversations(self, user_id: str, limit: int = 50) -> List[Dict]:
        await self.init_db()
        async with self.pool.acquire() as conn:
            rows = await conn.fetch(
                'SELECT * FROM conversations WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
                user_id, limit
            )
            return [dict(row) for row in rows]