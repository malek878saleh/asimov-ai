from fastapi import WebSocket
from app.core.ai.ollama_client import OllamaClient
import json

class ConnectionManager:
    def __init__(self):
        self.active_connections = {}
        self.ollama = OllamaClient()
    
    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, user_id: str):
        self.active_connections[user_id].remove(websocket)
    
    async def handle_chat(self, websocket: WebSocket, user_id: str, session_id: str):
        try:
            while True:
                data = await websocket.receive_json()
                message = data.get("message", "")
                
                # Stream AI response
                async for chunk in self.ollama.stream_response(
                    message, user_id, session_id
                ):
                    await websocket.send_json({
                        "type": "chunk",
                        "content": chunk
                    })
                
                # Send completion signal
                await websocket.send_json({
                    "type": "done",
                    "message": "Response complete"
                })
                
        except WebSocketDisconnect:
            self.disconnect(websocket, user_id)