from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn

app = FastAPI(title="AI Assistant Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for file uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Import routers
from app.api.routes import chat, memory, voice, files
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(memory.router, prefix="/api/memory", tags=["memory"])
app.include_router(voice.router, prefix="/api/voice", tags=["voice"])
app.include_router(files.router, prefix="/api/files", tags=["files"])

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)