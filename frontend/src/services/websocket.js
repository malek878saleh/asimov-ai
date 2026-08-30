class WebSocketService {
  constructor() {
    this.ws = null;
    this.handlers = [];
  }

  connect(userID, sessionID) {
    const url = `ws://localhost:8000/ws/${userID}/${sessionID}`;
    this.ws = new WebSocket(url);
    
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handlers.forEach(handler => handler(data));
      } catch (e) {
        console.error('WebSocket message error:', e);
      }
    };
    
    this.ws.onopen = () => console.log('WebSocket connected');
    this.ws.onclose = () => console.log('WebSocket disconnected');
    this.ws.onerror = (error) => console.error('WebSocket error:', error);
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(typeof data === 'string' ? data : JSON.stringify(data));
    }
  }

  onMessage(handler) {
    this.handlers.push(handler);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.handlers = [];
  }
}

export default new WebSocketService();