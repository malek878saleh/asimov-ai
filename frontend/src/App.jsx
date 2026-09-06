import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    const ws = new WebSocket(`ws://77.237.240.94:8000/ws/chat/test/test123`);
    
    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
      setMessages(prev => [...prev, { type: 'system', content: '✅ Connected to server' }]);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received:', data);
        if (data.type === 'response' || data.type === 'message') {
          setMessages(prev => [...prev, { 
            type: 'assistant', 
            content: data.response || data.message || 'Received response' 
          }]);
        }
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    };
    
    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
      setMessages(prev => [...prev, { type: 'system', content: '🔴 Disconnected from server' }]);
      // Reconnect after 3 seconds
      setTimeout(connectWebSocket, 3000);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    wsRef.current = ws;
  };

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      alert('Not connected to server');
      return;
    }
    
    const message = {
      type: 'chat',
      message: input,
      user_id: 'test',
      session_id: 'test123'
    };
    
    wsRef.current.send(JSON.stringify(message));
    setMessages(prev => [...prev, { type: 'user', content: input }]);
    setInput('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1>🤖 Asimov AI</h1>
        <span style={{ 
          color: isConnected ? '#28a745' : '#dc3545',
          fontWeight: 'bold'
        }}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </span>
      </div>
      
      <div style={{ 
        height: '400px', 
        overflowY: 'auto', 
        border: '1px solid #dee2e6', 
        padding: '15px',
        marginBottom: '15px',
        borderRadius: '8px',
        background: '#f8f9fa'
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#6c757d', marginTop: '180px' }}>
            Start a conversation...
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} style={{
            textAlign: msg.type === 'user' ? 'right' : 'left',
            margin: '8px 0'
          }}>
            <span style={{
              display: 'inline-block',
              padding: '10px 15px',
              borderRadius: '15px',
              background: msg.type === 'user' ? '#007bff' : 
                         msg.type === 'system' ? '#e9ecef' : '#28a745',
              color: msg.type === 'user' ? 'white' : 
                     msg.type === 'system' ? '#495057' : 'white',
              maxWidth: '80%',
              wordWrap: 'break-word'
            }}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          style={{ 
            flex: 1, 
            padding: '12px', 
            borderRadius: '8px', 
            border: '1px solid #ced4da',
            fontSize: '14px'
          }}
          disabled={!isConnected}
        />
        <button 
          onClick={sendMessage}
          disabled={!isConnected}
          style={{ 
            padding: '12px 24px', 
            borderRadius: '8px', 
            border: 'none',
            background: isConnected ? '#007bff' : '#6c757d',
            color: 'white',
            cursor: isConnected ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Send
        </button>
      </div>
      
      {!isConnected && (
        <div style={{ 
          marginTop: '15px', 
          padding: '12px', 
          background: '#fff3cd', 
          border: '1px solid #ffc107',
          borderRadius: '8px',
          color: '#856404',
          textAlign: 'center'
        }}>
          ⚠️ Disconnected from server. Reconnecting...
        </div>
      )}
    </div>
  );
}

export default App;
