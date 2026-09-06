import React, { useState, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

function VoiceControls({ userID, sessionID }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');

        // Send to backend for transcription
        try {
          const response = await fetch('http://localhost:8000/api/voice/transcribe', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          if (data.text) {
            // Send transcribed text to chat
            const wsMessage = JSON.stringify({ message: data.text });
            // You'd need to send this through your WebSocket connection
          }
        } catch (error) {
          console.error('Transcription error:', error);
        }
      };

      mediaRecorder.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Microphone error:', error);
    }
  };

  const stopListening = () => {
    if (mediaRecorder.current && isListening) {
      mediaRecorder.current.stop();
      setIsListening(false);
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const speakResponse = async (text) => {
    try {
      setIsSpeaking(true);
      const response = await fetch('http://localhost:8000/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      
      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      
      const audio = new Audio(url);
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
        setAudioURL(null);
      };
      await audio.play();
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`p-3 rounded-full transition ${
          isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-600 hover:bg-gray-700'
        }`}
        title={isListening ? 'Stop listening' : 'Start listening'}
      >
        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
      </button>
      
      <button
        onClick={() => speakResponse('Hello, I am your AI assistant with persistent memory.')}
        disabled={isSpeaking}
        className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 disabled:opacity-50 transition"
        title="Test voice output"
      >
        {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
      
      <div className="text-sm text-gray-400">
        {isListening && '🎤 Recording...'}
        {isSpeaking && '🔊 Speaking...'}
        {audioURL && '🔊 Audio ready'}
      </div>
    </div>
  );
}

export default VoiceControls;