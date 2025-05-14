import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  onFileUpload: (file: File) => Promise<void>;
  onSendMessage: (message: string) => Promise<void>;
  messages: Message[];
  isProcessing: boolean;
  isDarkMode: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onFileUpload,
  onSendMessage,
  messages,
  isProcessing,
  isDarkMode
}) => {
  const [message, setMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isProcessing) return;

    await onSendMessage(message.trim());
    setMessage('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onFileUpload(file);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div 
        ref={chatContainerRef}
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'assistant'
                  ? isDarkMode
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-900'
                  : 'bg-blue-600 text-white'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className={`max-w-[80%] rounded-lg p-3 ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}>
              Processing...
            </div>
          </div>
        )}
      </div>

      <div className={`p-4 border-t ${
        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.docx,.txt"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-2 rounded-lg ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Upload className={`h-5 w-5 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`} />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a question about your document..."
            className={`flex-1 p-2 rounded-lg ${
              isDarkMode
                ? 'bg-gray-700 text-white placeholder-gray-400'
                : 'bg-gray-100 text-gray-900 placeholder-gray-500'
            }`}
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!message.trim() || isProcessing}
            className={`p-2 rounded-lg ${
              !message.trim() || isProcessing
                ? 'bg-gray-300 cursor-not-allowed'
                : isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Send className="h-5 w-5 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface; 