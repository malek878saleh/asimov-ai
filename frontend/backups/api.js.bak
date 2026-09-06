import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export const api = {
  chat: {
    send: async (message, userID, sessionID) => {
      const response = await axios.post(`${API_BASE}/chat`, {
        message,
        user_id: userID,
        session_id: sessionID
      });
      return response.data;
    }
  },
  
  memory: {
    search: async (query, userID, limit = 5) => {
      const response = await axios.post(`${API_BASE}/memory/search`, {
        query,
        user_id: userID,
        limit
      });
      return response.data;
    },
    
    getConversations: async (userID, limit = 50) => {
      const response = await axios.get(`${API_BASE}/memory/conversations/${userID}?limit=${limit}`);
      return response.data;
    }
  },
  
  voice: {
    tts: async (text) => {
      const response = await axios.post(`${API_BASE}/voice/tts`, { text });
      return response.data;
    },
    
    stt: async (audioFile) => {
      const formData = new FormData();
      formData.append('audio', audioFile);
      const response = await axios.post(`${API_BASE}/voice/stt`, formData);
      return response.data;
    }
  },
  
  files: {
    upload: async (files, userID) => {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      const response = await axios.post(`${API_BASE}/files/upload`, formData);
      return response.data;
    },
    
    list: async () => {
      const response = await axios.get(`${API_BASE}/files/list`);
      return response.data;
    }
  }
};