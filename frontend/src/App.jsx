import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import VoiceControls from './components/VoiceControls';
import FileUpload from './components/FileUpload';
import MemoryPanel from './components/MemoryPanel';

function App() {
  const [userID, setUserID] = useState('user_123');
  const [sessionID] = useState('session_456');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto p-4">
        <header className="text-center py-6">
          <h1 className="text-4xl font-bold text-blue-400">AI Assistant</h1>
          <p className="text-gray-400">Your Jarvis with Persistent Memory</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3 bg-gray-800 rounded-xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <VoiceControls userID={userID} sessionID={sessionID} />
              <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">
                New Session
              </button>
            </div>
            <ChatInterface userID={userID} sessionID={sessionID} />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <FileUpload userID={userID} />
            <MemoryPanel userID={userID} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;