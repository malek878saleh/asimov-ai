import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeout = useRef(null);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, []);

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket(`ws://77.237.240.94:8000/ws/chat/asimov/free`);
      
      ws.onopen = () => {
        console.log('Connected to Asimov AI');
        setIsConnected(true);
        setMessages(prev => [...prev, { 
          type: 'system', 
          content: '🤖 Asimov AI is online - No Limits' 
        }]);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received:', data);
          
          if (data.type === 'thinking') {
            setIsThinking(true);
            setMessages(prev => [...prev, { 
              type: 'system', 
              content: '⏳ Asimov AI is thinking...' 
            }]);
          } else if (data.type === 'response') {
            setIsThinking(false);
            setMessages(prev => {
              // Remove the thinking message
              const filtered = prev.filter(msg => msg.content !== '⏳ Asimov AI is thinking...');
              return [...filtered, { 
                type: 'assistant', 
                content: data.response || 'No response' 
              }];
            });
          } else if (data.type === 'connection') {
            setIsConnected(true);
          } else if (data.type === 'error') {
            setMessages(prev => [...prev, { 
              type: 'system', 
              content: `⚠️ ${data.message}` 
            }]);
          }
        } catch (e) {
          console.error('Parse error:', e);
        }
      };

      ws.onclose = () => {
        console.log('Disconnected');
        setIsConnected(false);
        setIsThinking(false);
        setMessages(prev => [...prev, { 
          type: 'system', 
          content: '🔴 Disconnected. Reconnecting...' 
        }]);
        reconnectTimeout.current = setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setMessages(prev => [...prev, { 
          type: 'system', 
          content: '⚠️ Connection error. Retrying...' 
        }]);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Connection error:', error);
      setTimeout(connectWebSocket, 5000);
    }
  };

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setMessages(prev => [...prev, { 
        type: 'system', 
        content: '⚠️ Not connected. Please wait...' 
      }]);
      return;
    }

    const message = {
      type: 'chat',
      message: input,
      user_id: 'asimov',
      session_id: 'free'
    };

    wsRef.current.send(JSON.stringify(message));
    setMessages(prev => [...prev, { type: 'user', content: input }]);
    setInput('');
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '700px', 
      margin: '0 auto', 
      background: '#0a0a0a',
      minHeight: '100vh',
      color: '#fff'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '1px solid #333',
        paddingBottom: '15px'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#00ff88' }}>🤖 Asimov AI</h1>
          <p style={{ margin: 0, color: '#888', fontSize: '12px' }}>No Limits • No Boundaries</p>
        </div>
        <span style={{ 
          color: isConnected ? '#00ff88' : '#ff4444',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          {isThinking ? '⏳ Thinking...' : (isConnected ? '🟢 Online' : '🔴 Offline')}
        </span>
      </div>

      <div style={{ 
        height: '450px', 
        overflowY: 'auto', 
        border: '1px solid #333', 
        padding: '15px',
        marginBottom: '15px',
        borderRadius: '8px',
        background: '#111'
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '180px' }}>
            💬 Ask Asimov AI anything. No limits.
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} style={{
            textAlign: msg.type === 'user' ? 'right' : 'left',
            margin: '8px 0'
          }}>
            <span style={{
              display: 'inline-block',
              padding: '12px 18px',
              borderRadius: '15px',
              background: msg.type === 'user' ? '#00ff88' : 
                         msg.type === 'system' ? '#333' : '#1a1a1a',
              color: msg.type === 'user' ? '#000' : 
                     msg.type === 'system' ? '#ffaa00' : '#00ff88',
              maxWidth: '80%',
              wordWrap: 'break-word',
              border: msg.type === 'assistant' ? '1px solid #00ff88' : 'none'
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
          placeholder="Ask anything..."
          style={{ 
            flex: 1, 
            padding: '14px', 
            borderRadius: '8px', 
            border: '1px solid #333',
            background: '#111',
            color: '#fff',
            fontSize: '14px'
          }}
          disabled={!isConnected || isThinking}
        />
        <button 
          onClick={sendMessage}
          disabled={!isConnected || isThinking}
          style={{ 
            padding: '14px 28px', 
            borderRadius: '8px', 
            border: 'none',
            background: (isConnected && !isThinking) ? '#00ff88' : '#444',
            color: (isConnected && !isThinking) ? '#000' : '#888',
            cursor: (isConnected && !isThinking) ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Send
        </button>
      </div>

      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        textAlign: 'center',
        color: '#444',
        fontSize: '12px',
        borderTop: '1px solid #222'
      }}>
        Asimov AI • No Limits • No Boundaries
      </div>
    </div>
  );
}

export default App;
