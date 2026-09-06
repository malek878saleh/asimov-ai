import httpx
import json
from typing import Optional, Dict, Any

class OllamaClient:
    def __init__(self, base_url: str = "http://localhost:11434", model: str = "llama2"):
        self.base_url = base_url
        self.model = model
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def chat(self, message: str, user_id: str = "", session_id: str = "") -> Dict[str, Any]:
        try:
            response = await self.client.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": message,
                    "stream": False
                }
            )
            response.raise_for_status()
            data = response.json()
            return {
                "response": data.get("response", ""),
                "model": self.model
            }
        except Exception as e:
            return {
                "response": f"Ollama error: {str(e)}",
                "model": "fallback",
                "error": str(e)
            }
    
    async def close(self):
        await self.client.aclose()

ollama_client = OllamaClient()
