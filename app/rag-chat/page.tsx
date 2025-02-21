'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function RagChat() {
  const params = useParams();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setMessages(prev => [...prev, { role: 'assistant', content: `Response to: ${input}` }]);
    setInput('');
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">AI Help</h1>
      
      <div className="bg-gray-50 rounded-lg p-4 h-[60vh] overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div 
            key={index}
            className={`mb-4 p-3 rounded-lg ${
              message.role === 'user' 
                ? 'bg-orange-100 ml-auto max-w-[80%]' 
                : 'bg-white border border-gray-200 max-w-[80%]'
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Ask about your notes..."
        />
        <button 
          type="submit"
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all shadow-md hover:shadow-lg"
        >
          Send
        </button>
      </form>
    </main>
  );
} 