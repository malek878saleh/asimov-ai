// API Configuration
const API_URL = 'http://77.237.240.94:8000';
const WS_URL = 'ws://77.237.240.94:8000';

export const config = {
  apiUrl: API_URL,
  wsUrl: WS_URL,
  endpoints: {
    chat: `${API_URL}/api/chat`,
    memory: `${API_URL}/api/memory`,
    files: `${API_URL}/api/files`,
    voice: `${API_URL}/api/voice`,
    health: `${API_URL}/health`,
  }
};

export default config;
