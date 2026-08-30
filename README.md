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
git checkout test2