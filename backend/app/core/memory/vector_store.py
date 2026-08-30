import chromadb
from chromadb.utils import embedding_functions
import uuid
from datetime import datetime
from typing import List, Dict

class VectorMemory:
    def __init__(self):
        self.client = chromadb.PersistentClient(
            path="./chroma_db"
        )
        self.embedding_fn = embedding_functions.OllamaEmbeddingFunction(
            model_name="nomic-embed-text:latest"
        )
        self.collection = self.client.get_or_create_collection(
            name="memories",
            embedding_function=self.embedding_fn
        )
    
    async def add_memory(self, 
                        query: str, 
                        response: str,
                        user_id: str,
                        session_id: str,
                        metadata: Dict = None):
        """Add memory to vector store"""
        memory_id = str(uuid.uuid4())
        text = f"User: {query}\nAssistant: {response}"
        
        self.collection.add(
            documents=[text],
            ids=[memory_id],
            metadatas=[{
                "user_id": user_id,
                "session_id": session_id,
                "timestamp": datetime.utcnow().isoformat(),
                "query": query,
                **(metadata or {})
            }]
        )
        return memory_id
    
    async def similarity_search(self, 
                               query: str, 
                               user_id: str,
                               k: int = 5) -> List[Dict]:
        """Search for relevant memories"""
        results = self.collection.query(
            query_texts=[query],
            n_results=k,
            where={"user_id": user_id}
        )
        
        memories = []
        if results['documents']:
            for doc, metadata in zip(results['documents'][0], 
                                    results['metadatas'][0]):
                memories.append({
                    "text": doc,
                    "metadata": metadata
                })
        return memories