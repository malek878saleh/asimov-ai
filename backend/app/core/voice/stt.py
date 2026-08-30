import vosk
import json
import wave
import os

class SpeechToText:
    def __init__(self):
        self.model_path = "models/vosk-model-en-us-0.22"
        if not os.path.exists(self.model_path):
            print("Downloading Vosk model...")
            os.makedirs("models", exist_ok=True)
            import urllib.request, zipfile
            url = "https://alphacephei.com/vosk/models/vosk-model-en-us-0.22.zip"
            urllib.request.urlretrieve(url, "models/vosk-model.zip")
            with zipfile.ZipFile("models/vosk-model.zip", 'r') as zip_ref:
                zip_ref.extractall("models")
            os.remove("models/vosk-model.zip")
        self.model = vosk.Model(self.model_path)
        self.recognizer = vosk.KaldiRecognizer(self.model, 16000)
    
    async def transcribe(self, audio_file: str):
        try:
            wf = wave.open(audio_file, "rb")
            text_parts = []
            while True:
                data = wf.readframes(4000)
                if len(data) == 0:
                    break
                if self.recognizer.AcceptWaveform(data):
                    result = json.loads(self.recognizer.Result())
                    if result.get("text"):
                        text_parts.append(result["text"])
            final = json.loads(self.recognizer.FinalResult())
            if final.get("text"):
                text_parts.append(final["text"])
            return " ".join(text_parts)
        except Exception as e:
            print(f"Error: {e}")
            return ""