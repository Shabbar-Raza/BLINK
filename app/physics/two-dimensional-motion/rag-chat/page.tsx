'use client';

import { useState } from 'react';
import { ArrowLeft, Send, Bot, User, Info, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function RagChat() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setMessages(prev => [...prev, { role: 'assistant', content: `Response to: ${input}` }]);
    setInput('');
  };

  // Welcome message component
  const WelcomeMessage = () => (
    <div className="text-center p-4 space-y-3">
      <div className="flex justify-center">
        <Sparkles className="h-12 w-12 text-orange-500" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800">Welcome to Physics RAG Chat!</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        Ask questions about Two-Dimensional Motion and get instant answers based on your course notes.
      </p>
    </div>
  );

  // Suggested questions
  const suggestedQuestions = [
    "What is projectile motion?",
    "How do you calculate the range of a projectile?",
    "Explain the independence of horizontal and vertical motion",
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link 
            href="/physics/two-dimensional-motion"
            className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <h1 className="text-xl font-semibold text-center text-orange-600">RAG Chat</h1>
          <div className="w-[72px]">
            <Info className="h-5 w-5 text-gray-400 hover:text-orange-600 cursor-pointer" />
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-orange-50">
        {messages.length === 0 ? (
          <>
            <WelcomeMessage />
            <div className="space-y-2 p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Suggested questions:</h3>
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="block w-full text-left p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-700 hover:bg-orange-50"
                >
                  {question}
                </button>
              ))}
            </div>
          </>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-start gap-2 max-w-[80%]">
                {message.role === 'assistant' && (
                  <div className="bg-orange-100 p-1.5 rounded-full">
                    <Bot className="h-4 w-4 text-orange-600" />
                  </div>
                )}
                <div 
                  className={`p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white text-gray-800 shadow-md'
                  }`}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <div className="bg-orange-100 p-1.5 rounded-full">
                    <User className="h-4 w-4 text-orange-600" />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-orange-100">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-orange-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Type your message..."
          />
          <button 
            type="submit"
            className="p-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full hover:from-orange-600 hover:to-yellow-600 transition-colors shadow-md"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
} 