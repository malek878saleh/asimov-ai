from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
import httpx
from typing import Dict, Set

app = FastAPI(
    title="AI Assistant Backend",
    version="1.0.0",
    description="Asimov AI Backend API"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://77.237.240.94:3000",
        "http://localhost:3000",
        "http://localhost:5173",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str, session_id: str):
        await websocket.accept()
        key = f"{user_id}_{session_id}"
        if key not in self.active_connections:
            self.active_connections[key] = set()
        self.active_connections[key].add(websocket)
    
    def disconnect(self, websocket: WebSocket, user_id: str, session_id: str):
        key = f"{user_id}_{session_id}"
        if key in self.active_connections:
            self.active_connections[key].discard(websocket)
            if not self.active_connections[key]:
                del self.active_connections[key]
    
    async def send_message(self, message: str, user_id: str, session_id: str):
        key = f"{user_id}_{session_id}"
        if key in self.active_connections:
            for connection in self.active_connections[key]:
                await connection.send_text(message)

manager = ConnectionManager()

# Ollama Client
class OllamaClient:
    def __init__(self, base_url: str = "http://localhost:11434", model: str = "dolphin-llama3:8b"):
        self.base_url = base_url
        self.model = model
    
    async def get_response(self, message: str) -> str:
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": message,
                        "stream": False,
                        "options": {
                            "temperature": 0.7,
                            "top_p": 0.9
                        }
                    }
                )
                if response.status_code == 200:
                    data = response.json()
                    return data.get("response", "No response from model")
                else:
                    return f"Ollama error: {response.status_code}"
        except Exception as e:
            return f"Ollama not available: {str(e)}"

ollama_client = OllamaClient()

# WebSocket Endpoint with Ollama
@app.websocket("/ws/chat/{user_id}/{session_id}")
async def websocket_chat(websocket: WebSocket, user_id: str, session_id: str):
    await manager.connect(websocket, user_id, session_id)
    try:
        # Send connection confirmation
        await websocket.send_text(json.dumps({
            "type": "connection",
            "status": "connected",
            "message": f"Connected to AI assistant"
        }))
        
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            try:
                message_data = json.loads(data)
                user_message = message_data.get('message', '')
                
                if not user_message:
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "message": "Empty message"
                    }))
                    continue
                
                # Get AI response from Ollama
                ai_response = await ollama_client.get_response(user_message)
                
                # Send response back to client
                await websocket.send_text(json.dumps({
                    "type": "response",
                    "response": ai_response,
                    "user_id": user_id,
                    "session_id": session_id,
                    "model": ollama_client.model
                }))
                
            except json.JSONDecodeError:
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": "Invalid JSON format"
                }))
            except Exception as e:
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": f"Error processing message: {str(e)}"
                }))
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id, session_id)
    except Exception as e:
        print(f"WebSocket error: {e}")

@app.websocket("/ws/memory/{user_id}/{session_id}")
async def websocket_memory(websocket: WebSocket, user_id: str, session_id: str):
    await websocket.accept()
    try:
        await websocket.send_text(json.dumps({
            "type": "connection",
            "status": "connected",
            "message": "Connected to memory server"
        }))
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(json.dumps({
                "type": "memory_response",
                "data": "Memory operation received"
            }))
    except WebSocketDisconnect:
        pass

# REST Endpoints
@app.get("/")
async def root():
    return {
        "message": "AI Assistant Backend",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ai-assistant-backend"
    }

# Import and mount API routes
from app.api.routes import chat, memory, voice, files

app.include_router(chat.router, prefix="/api")
app.include_router(memory.router, prefix="/api")
app.include_router(voice.router, prefix="/api")
app.include_router(files.router, prefix="/api")
