// WebSocket Configuration
const SERVER_IP = import.meta.env.VITE_WS_URL || 
                  import.meta.env.REACT_APP_WS_URL || 
                  'ws://77.237.240.94:8000';

export function connectWebSocket(userID, sessionID) {
  const url = `${SERVER_IP}/ws/chat/${userID}/${sessionID}`;
  return new WebSocket(url);
}

export function connectMemoryWebSocket(userID, sessionID) {
  const url = `${SERVER_IP}/ws/memory/${userID}/${sessionID}`;
  return new WebSocket(url);
}

export default {
  connectWebSocket,
  connectMemoryWebSocket
};
