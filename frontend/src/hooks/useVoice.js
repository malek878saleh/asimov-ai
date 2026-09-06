import { useState } from 'react';

const SERVER_IP = import.meta.env.VITE_API_URL || 
                  import.meta.env.REACT_APP_API_URL || 
                  'http://77.237.240.94:8000';

export function useVoice() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  const textToSpeech = async (text) => {
    try {
      const response = await fetch(`${SERVER_IP}/api/voice/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, voice: 'default' })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('TTS Error:', error);
      throw error;
    }
  };

  const speechToText = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      const response = await fetch(`${SERVER_IP}/api/voice/stt`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('STT Error:', error);
      throw error;
    }
  };

  return {
    isRecording,
    setIsRecording,
    audioUrl,
    setAudioUrl,
    textToSpeech,
    speechToText
  };
}
