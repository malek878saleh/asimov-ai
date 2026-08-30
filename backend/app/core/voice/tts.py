import torch
from TTS.api import TTS
import os

class TextToSpeech:
    def __init__(self):
        self.tts = TTS("tts_models/en/ljspeech/tacotron2-DDC")
        self.output_dir = "voice_outputs"
        os.makedirs(self.output_dir, exist_ok=True)
    
    async def generate_speech(self, text: str, voice_id: str = "default"):
        """Generate speech from text"""
        output_path = f"{self.output_dir}/{voice_id}_{hash(text)}.wav"
        self.tts.tts_to_file(text=text, file_path=output_path)
        return output_path
