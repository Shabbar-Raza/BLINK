'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Send, Home, Plus, UserCircle, MessageSquare, Clock, Trash2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI('AIzaSyDb-YJi-b1RW3I_g2OfacTBFHBk2GPLOhI');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: "Hello! I'm your AI study assistant. How can I help you today?", isUser: false },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    {
      id: '1',
      title: 'Physics Help',
      timestamp: '2 hours ago',
      preview: 'Can you explain quantum mechanics?'
    },
    {
      id: '2',
      title: 'Math Problem',
      timestamp: '5 hours ago',
      preview: 'Help with calculus derivatives'
    },
  ]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setMessages(prev => [...prev, { text: inputMessage, isUser: true }]);
      setInputMessage('');

      const result = await model.generateContent(inputMessage);
      const response = await result.response;
      const aiMessage = response.text();

      setMessages(prev => [...prev, { text: aiMessage, isUser: false }]);
      
      // Add to chat history
      setChatHistory(prev => [{
        id: Date.now().toString(),
        title: inputMessage.slice(0, 30) + '...',
        timestamp: 'Just now',
        preview: inputMessage
      }, ...prev]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, { 
        text: "I'm sorry, I encountered an error. Please try again.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar Toggle Button */}
      <motion.button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed left-4 top-4 z-50 p-2 rounded-lg bg-white shadow-lg ${
          isSidebarOpen ? 'translate-x-80' : 'translate-x-0'
        } transition-transform duration-300`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageSquare className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
          isSidebarOpen ? 'rotate-180' : ''
        }`} />
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            
            {/* Sidebar Content */}
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed lg:relative w-80 h-screen bg-white border-r border-gray-200 flex flex-col z-40"
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Chat History</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Chat History List */}
              <div className="flex-1 overflow-y-auto">
                {chatHistory.map((chat) => (
                  <motion.div
                    key={chat.id}
                    whileHover={{ backgroundColor: '#f3f4f6' }}
                    className="p-4 border-b border-gray-100 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{chat.title}</h3>
                        <p className="text-sm text-gray-500 truncate">{chat.preview}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">{chat.timestamp}</span>
                        </div>
                      </div>
                      <button className="p-1 hover:bg-gray-100 rounded-full">
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* New Chat Button */}
              <div className="p-4 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Chat
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between relative">
          {/* Home Button */}
          <Link href="/" className="text-gray-600 hover:text-gray-900 absolute left-6">
            <Home className="w-5 h-5" />
          </Link>

          {/* Centered Title */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-xl font-semibold text-gray-800">Study Assistant</h1>
          </div>

          {/* Empty div for balance */}
          <div className="w-5" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.isUser ? 'bg-blue-600' : 'bg-gray-200'
                }`}>
                  {message.isUser ? (
                    <UserCircle className="w-5 h-5 text-white" />
                  ) : (
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div
                  className={`p-4 rounded-2xl ${
                    message.isUser
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                </div>
                <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none p-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="flex gap-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading}
                className={`bg-blue-600 text-white rounded-xl px-6 py-3 flex items-center gap-2 ${
                  isLoading ? 'opacity-50' : 'hover:bg-blue-700'
                }`}
              >
                <Send className="w-5 h-5" />
                <span>Send</span>
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 