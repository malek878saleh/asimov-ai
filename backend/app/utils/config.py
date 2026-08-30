import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    MODEL_NAME = os.getenv("MODEL_NAME", "dolphin-phi:latest")
    POSTGRES_HOST = os.getenv("POSTGRES_HOST", "postgres")