import React, { useState, useRef, useEffect } from 'react';
import useWebSocket from '../hooks/useWebSocket';

function ChatInterface({ userID, sessionID }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { sendMessage, isConnected, lastMessage } = useWebSocket(
    `ws://localhost:8000/ws/chat/${userID}/${sessionID}`
  );

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        if (data.type === 'chunk') {
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.role === 'assistant' && last.isStreaming) {
              return [
                ...prev.slice(0, -1),
                { ...last, content: last.content + data.content }
              ];
            }
            return [...prev, { role: 'assistant', content: data.content, isStreaming: true }];
          });
        } else if (data.type === 'done') {
          setIsStreaming(false);
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.isStreaming) {
              return [
                ...prev.slice(0, -1),
                { ...last, isStreaming: false }
              ];
            }
            return prev;
          });
        }
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);
    
    sendMessage(JSON.stringify({ message: input }));
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p>Start a conversation with your AI assistant</p>
            <p className="text-sm">It remembers everything you say</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-100'
              } ${msg.isStreaming ? 'border-l-4 border-blue-400' : ''}`}
            >
              {msg.content}
              {msg.isStreaming && (
                <span className="animate-pulse ml-1">▍</span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-700 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!isConnected}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming || !isConnected}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-semibold transition"
          >
            Send
          </button>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</span>
          <span>{isStreaming ? '🔄 Streaming...' : '⚡ Ready'}</span>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;