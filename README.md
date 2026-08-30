# Asimov AI - Unrestricted AI Assistant

A complete AI assistant with persistent memory, voice capabilities, and a web interface.

## Features

- 🧠 **Persistent Memory**: Remembers everything across sessions using ChromaDB + PostgreSQL
- 🎤 **Voice System**: Jarvis-like text-to-speech and speech-to-text
- 📁 **File Embedding**: Upload PDFs, DOCX, TXT files for AI context
- 🤖 **Unrestricted AI**: Powered by Dolphin-Phi on Ollama
- 🌐 **Web Interface**: Modern React + Tailwind CSS frontend
- 🔄 **Real-time**: WebSocket streaming responses

## Tech Stack

- **Backend**: FastAPI, Python 3.11
- **AI Model**: Ollama + Dolphin-Phi
- **Memory**: ChromaDB (vector) + PostgreSQL (relational)
- **Voice**: Coqui TTS + Vosk STT
- **Frontend**: React, Tailwind CSS, Vite

## Quick Start

### Prerequisites
- Docker & Docker Compose
- 16GB+ RAM recommended

### 1. Clone the repository
```bash
git clone https://github.com/malek878saleh/asimov-ai.git
cd asimov-ai
git checkout test2```

### 2. Start the services
bash
docker-compose up -d --build
3. Pull the AI models
bash
docker exec -it ollama ollama pull dolphin-phi:latest
docker exec -it ollama ollama pull nomic-embed-text:latest
4. Access the application
Frontend: http://localhost:3000

Backend API: http://localhost:8000

Ollama API: http://localhost:11434

Project Structure
text
asimov-ai/
├── backend/
│   ├── app/
│   │   ├── api/          # API routes & WebSocket
│   │   ├── core/         # AI, Memory, Voice modules
│   │   ├── models/       # Pydantic schemas
│   │   ├── utils/        # Config & utilities
│   │   └── main.py       # FastAPI entry point
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API & WebSocket services
│   │   └── App.jsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
API Endpoints
Method	Endpoint	Description
POST	/api/chat	Send a message
POST	/api/memory/search	Search memories
POST	/api/voice/tts	Text-to-speech
POST	/api/voice/stt	Speech-to-text
POST	/api/files/upload	Upload files
WebSocket	/ws/{user_id}/{session_id}	Real-time chat
Deployment on Contabo
SSH into your Contabo VPS

Clone the repository

Run docker-compose up -d --build

Open ports 3000, 8000, 11434 in firewall

Access via your VPS IP

Development
Backend
bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
Frontend

```bash
cd frontend
npm install
npm run dev```

Contributing
Contributions are welcome! Please feel free to submit a Pull Request.