'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, BookOpen, Brain, Pencil, ExternalLink, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { FileIcon } from 'lucide-react';
import styles from '@/app/styles/notes.module.css';
import { marked } from 'marked';
import { SavedNote } from '@/app/types';
import Quiz from '@/app/components/Quiz';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  isDarkMode: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label, isDarkMode }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200
      ${active 
        ? 'bg-purple-600 text-white shadow-md' 
        : isDarkMode
          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }
    `}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

interface Topic {
  _id: string;
  title: string;
  courseId: string;
  fileUrl?: string;
  fileType?: string;
  generatedNotes?: string;
  savedNotes?: SavedNote[];
  fileId?: string;
  content?: string;
}

const isProcessableFileType = (fileType: string): boolean => {
  const type = fileType.toLowerCase();
  return (
    type.includes('pdf') ||
    type.includes('doc') ||
    type.includes('docx') ||
    type.includes('txt') ||
    type.includes('csv') ||
    type.includes('xls') ||
    type.includes('xlsx') ||
    type.includes('ppt') ||
    type.includes('pptx') ||
    type.includes('html')
  );
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function TopicPage() {
  const params = useParams();
  const { isDarkMode } = useTheme();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notes');
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [documentText, setDocumentText] = useState('');
  const [error, setError] = useState('');
  const [isPdfProcessing, setIsPdfProcessing] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    const fetchTopic = async () => {
      const topicId = params?.topicId as string;
      if (!topicId) return;

      try {
        const response = await fetch(`/api/topics/${topicId}`);
        const data = await response.json();
        console.log('Topic data received in page:', data);
        if (data.topic) {
          console.log('File URL:', data.topic.fileUrl);
          console.log('File Type:', data.topic.fileType);
        }
        setTopic(data.topic);
      } catch (error) {
        console.error('Error fetching topic:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [params?.topicId]);

  const handleRename = async () => {
    if (!newTitle.trim() || !params?.topicId) return;

    try {
      const response = await fetch(`/api/topics/${params.topicId}/rename`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newTitle: newTitle.trim() })
      });

      if (response.ok) {
        setTopic(prev => prev ? { ...prev, title: newTitle.trim() } : null);
        setIsRenaming(false);
        setNewTitle('');
      }
    } catch (error) {
      console.error('Error renaming topic:', error);
    }
  };

  const handleGenerateNotes = async () => {
    if (!documentText.trim()) {
      setError('Please enter some text to generate notes from');
      return;
    }

    setIsGeneratingNotes(true);
    setError('');

    try {
      const response = await fetch(`/api/topics/${topic?._id}/generate-notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentText })
      });

      if (!response.ok) {
        throw new Error('Failed to generate notes');
      }

      const { notes } = await response.json();
      setTopic(prev => prev ? { ...prev, generatedNotes: notes } : null);
      setDocumentText('');
    } catch (error) {
      console.error('Error generating notes:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate notes');
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  const handleGenerateNotesFromPdf = async () => {
    if (!topic?.fileId) {
      setError('No file found');
      return;
    }

    setIsPdfProcessing(true);
    setError('');

    try {
      // 1. Fetch the file from our database
      const fileResponse = await fetch(`/api/files/${topic.fileId}`);
      if (!fileResponse.ok) {
        throw new Error('Failed to fetch file');
      }
      
      const fileData = await fileResponse.json();
      
      // Convert base64 back to Blob
      const binaryString = atob(fileData.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const fileBlob = new Blob([bytes], { type: fileData.contentType });

      // 2. Extract text using local FastAPI endpoint
      const formData = new FormData();
      formData.append('file', fileBlob, fileData.filename);

      const extractResponse = await fetch('http://localhost:8000/extract-text/', {
        method: 'POST',
        body: formData
      });

      if (!extractResponse.ok) {
        throw new Error('Failed to extract text from document');
      }

      const { text: extractedText } = await extractResponse.json();

      if (!extractedText) {
        throw new Error('No text could be extracted from the document');
      }

      // Store the extracted content
      const contentResponse = await fetch(`/api/topics/${topic._id}/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: extractedText })
      });

      if (!contentResponse.ok) {
        throw new Error('Failed to store extracted content');
      }

      // 3. Generate notes using OpenAI
      const notesResponse = await fetch(`/api/topics/${topic._id}/generate-notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentText: extractedText })
      });

      if (!notesResponse.ok) {
        throw new Error('Failed to generate notes');
      }

      const { notes } = await notesResponse.json();
      setTopic(prev => prev ? { ...prev, generatedNotes: notes } : null);

    } catch (error) {
      console.error('Error processing document:', error);
      setError(error instanceof Error ? error.message : 'Failed to process document');
    } finally {
      setIsPdfProcessing(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!topic?.generatedNotes) return;
    
    setIsSavingNote(true);
    setError('');

    try {
      const response = await fetch(`/api/topics/${topic._id}/save-notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: topic.generatedNotes })
      });

      if (!response.ok) {
        throw new Error('Failed to save notes');
      }

      const { savedNote } = await response.json();
      setTopic(prev => prev ? {
        ...prev,
        savedNotes: [...(prev.savedNotes || []), savedNote]
      } : null);
    } catch (error) {
      console.error('Error saving notes:', error);
      setError(error instanceof Error ? error.message : 'Failed to save notes');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!topic?._id) return;

    try {
      const response = await fetch(`/api/topics/${topic._id}/notes/${noteId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      setTopic(prev => prev ? {
        ...prev,
        savedNotes: prev.savedNotes?.filter(note => note.id !== noteId) || []
      } : null);
    } catch (error) {
      console.error('Error deleting note:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete note');
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || !topic?.content) return;

    try {
      setMessages(prev => [...prev, { role: 'user', content: message }]);
      setNewMessage('');
      setIsChatLoading(true);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: message,
          context: topic.content,
          history: messages
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsChatLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!topic) return <div>Topic not found</div>;

  const renderedNotes = topic.generatedNotes ? String(marked.parse(topic.generatedNotes)) : 'No notes available yet. Enter text above to generate notes.';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            href={`/courses/${topic.courseId}`}
            className={`inline-flex items-center gap-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Course</span>
          </Link>
          
          <div className="flex items-center justify-between mt-4">
            {isRenaming ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={`px-2 py-1 rounded border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                  placeholder="Enter new title"
                  autoFocus
                />
                <button
                  onClick={handleRename}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsRenaming(false);
                    setNewTitle('');
                  }}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {topic.title}
                </h1>
                <button
                  onClick={() => {
                    setIsRenaming(true);
                    setNewTitle(topic.title);
                  }}
                  className={`p-1 rounded-full hover:bg-gray-100 ${
                    isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500'
                  }`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex gap-4 mt-6">
            <TabButton 
              active={activeTab === 'view'} 
              onClick={() => setActiveTab('view')}
              icon={<Eye className="h-4 w-4" />}
              label="View"
              isDarkMode={isDarkMode}
            />
            <TabButton 
              active={activeTab === 'notes'} 
              onClick={() => setActiveTab('notes')}
              icon={<BookOpen className="h-4 w-4" />}
              label="Notes"
              isDarkMode={isDarkMode}
            />
            <TabButton 
              active={activeTab === 'chat'} 
              onClick={() => setActiveTab('chat')}
              icon={<MessageSquare className="h-4 w-4" />}
              label="Chat"
              isDarkMode={isDarkMode}
            />
            <TabButton 
              active={activeTab === 'quiz'} 
              onClick={() => setActiveTab('quiz')}
              icon={<Brain className="h-4 w-4" />}
              label="Quiz"
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'view' && (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Course Materials
            </h2>
            {topic.fileUrl && topic.fileType ? (
              <div className={`p-6 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    isDarkMode ? 'bg-gray-600' : 'bg-white'
                  }`}>
                    <FileIcon className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {topic.fileType.toUpperCase()} Document
                    </h3>
                    <a 
                      href={topic.fileUrl}
                      className="text-purple-600 hover:text-purple-700 text-sm mt-1 inline-flex items-center gap-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Document
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`p-6 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>
                  No materials uploaded yet
                </p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'notes' && (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Study Notes
              </h2>
              <div className="flex gap-2">
                {topic.fileType && isProcessableFileType(topic.fileType) && (
                  <button
                    onClick={handleGenerateNotesFromPdf}
                    disabled={isPdfProcessing}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isPdfProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    {isPdfProcessing ? 'Processing Document...' : 'Generate Notes from Document'}
                  </button>
                )}
                {!topic.generatedNotes && (
                  <button
                    onClick={handleGenerateNotes}
                    disabled={isGeneratingNotes}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isGeneratingNotes
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700'
                    } text-white`}
                  >
                    {isGeneratingNotes ? 'Generating...' : 'Generate Notes'}
                  </button>
                )}
                {topic.generatedNotes && (
                  <button
                    onClick={handleSaveNotes}
                    disabled={isSavingNote}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isSavingNote
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                  >
                    {isSavingNote ? 'Saving...' : 'Save Notes'}
                  </button>
                )}
              </div>
            </div>
            
            {error && (
              <p className="text-red-500 mb-4">{error}</p>
            )}

            {!topic.generatedNotes && (
              <div className="mb-6">
                <textarea
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  placeholder="Enter or paste your document text here..."
                  className={`w-full h-48 p-4 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>
            )}
            
            {topic.generatedNotes && (
              <div className="mb-8">
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Current Notes
                </h3>
                <div
                  className={`${styles.notesContainer} ${styles.notesContent} ${isDarkMode ? 'dark' : ''}`}
                  dangerouslySetInnerHTML={{ __html: renderedNotes }}
                />
              </div>
            )}

            {/* Saved Notes Section */}
            {topic.savedNotes && topic.savedNotes.length > 0 && (
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Saved Versions
                </h3>
                <div className="space-y-4">
                  {topic.savedNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-4 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {new Date(note.timestamp).toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                      <div
                        className={`${styles.notesContainer} ${styles.notesContent} ${isDarkMode ? 'dark' : ''}`}
                        dangerouslySetInnerHTML={{ __html: String(marked.parse(note.content)) }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'chat' && (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Chat with Document
              </h2>
            </div>

            {error && (
              <p className="text-red-500 mb-4">{error}</p>
            )}

            {!topic.content ? (
              <div className={`p-6 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>
                  No document content available for chat
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 h-[400px] overflow-y-auto border rounded-lg p-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-4 ${
                        message.role === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div
                        className={`inline-block max-w-[70%] rounded-lg px-4 py-2 ${
                          message.role === 'user'
                            ? isDarkMode
                              ? 'bg-purple-600 text-white'
                              : 'bg-purple-100 text-purple-900'
                            : isDarkMode
                            ? 'bg-gray-700 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="text-center">
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Thinking...
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(newMessage);
                      }
                    }}
                    placeholder="Ask a question about the document..."
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    }`}
                    disabled={isChatLoading}
                  />
                  <button
                    onClick={() => sendMessage(newMessage)}
                    disabled={isChatLoading || !newMessage.trim()}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isChatLoading || !newMessage.trim()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700'
                    } text-white`}
                  >
                    Send
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        
        {activeTab === 'quiz' && (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Quiz
            </h2>
            <Quiz 
              topicContent={topic?.content || ''} 
              isDarkMode={isDarkMode}
              topicId={topic?._id || ''}
            />
          </div>
        )}
      </main>
    </div>
  );
}