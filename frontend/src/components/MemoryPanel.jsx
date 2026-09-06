import React, { useState } from 'react';
import { Database, Search } from 'lucide-react';

function MemoryPanel({ userID }) {
  const [memories, setMemories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const searchMemories = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await fetch('http://77.237.240.94:8000/api/memory/search', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, user_id: userID, limit: 10 }),
      });
      const data = await response.json();
      setMemories(data.memories || []);
    } catch (error) { console.error(error); }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <h3 className="font-semibold mb-3 flex items-center gap-2"><Database size={18} /> Memory Store</h3>
      <div className="flex gap-2 mb-3">
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchMemories()}
          placeholder="Search memories..." className="flex-1 bg-gray-700 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
        <button onClick={searchMemories} className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg text-sm">
          <Search size={16} />
        </button>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {memories.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No memories found.</p>}
        {memories.map((memory, idx) => (
          <div key={idx} className="bg-gray-700 rounded-lg p-2 text-sm">
            <p className="text-gray-300 truncate">{memory.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MemoryPanel;