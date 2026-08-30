import vosk
import json
import wave
import pyaudio

class SpeechToText:
    def __init__(self, model_path="models/vosk-model-en-us-0.22"):
        self.model = vosk.Model(model_path)
        self.recognizer = vosk.KaldiRecognizer(self.model, 16000)
        self.audio = pyaudio.PyAudio()
    
    async def transcribe(self, audio_file: str):
        """Transcribe audio file to text"""
        wf = wave.open(audio_file, "rb")
        
        while True:
            data = wf.readframes(4000)
            if len(data) == 0:
                break
            if self.recognizer.AcceptWaveform(data):
                result = json.loads(self.recognizer.Result())
                return result.get("text", "")
        
        return ""