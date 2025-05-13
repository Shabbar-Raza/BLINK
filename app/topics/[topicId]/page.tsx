'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, BookOpen, Brain, Pencil, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { FileIcon } from 'lucide-react';
import styles from '@/app/styles/notes.module.css';
import { marked } from 'marked';

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
}

export default function TopicPage() {
  const params = useParams();
  const { isDarkMode } = useTheme();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [activeTab, setActiveTab] = useState('view');
  const [loading, setLoading] = useState(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [documentText, setDocumentText] = useState('');
  const [error, setError] = useState('');

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

    if (!params?.topicId) {
      setError('Topic ID is missing');
      return;
    }

    setIsGeneratingNotes(true);
    setError('');

    try {
      console.log('Sending request to generate notes...');
      const response = await fetch('/api/notes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentText }),
      });

      const data = await response.json();
      console.log('Received response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate notes');
      }

      // Update the topic with the generated notes
      console.log('Updating topic with generated notes...');
      const updateResponse = await fetch(`/api/topics/${params.topicId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ generatedNotes: data.notes }),
      });

      console.log('Update response status:', updateResponse.status);
      if (updateResponse.ok) {
        const updatedTopic = await updateResponse.json();
        console.log('Updated topic:', updatedTopic);
        setTopic(prev => prev ? { ...prev, generatedNotes: data.notes } : null);
      } else {
        throw new Error('Failed to update topic with generated notes');
      }
    } catch (error) {
      console.error('Error in handleGenerateNotes:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate notes');
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!topic) return <div>Topic not found</div>;

  const renderedNotes = topic.generatedNotes ? marked.parse(topic.generatedNotes) : 'No notes available yet. Enter text above to generate notes.';

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
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Study Notes
            </h2>
            
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
                {error && (
                  <p className="text-red-500 mt-2">{error}</p>
                )}
                <button
                  onClick={handleGenerateNotes}
                  disabled={isGeneratingNotes}
                  className={`mt-4 px-4 py-2 rounded-lg ${
                    isGeneratingNotes
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
                  } text-white`}
                >
                  {isGeneratingNotes ? 'Generating Notes...' : 'Generate Notes'}
                </button>
              </div>
            )}
            
            <div
              className={`${styles.notesContainer} ${styles.notesContent} ${isDarkMode ? 'dark' : ''}`}
              dangerouslySetInnerHTML={{ __html: renderedNotes }}
            />
          </div>
        )}
        
        {activeTab === 'quiz' && (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Quiz
            </h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Start Quiz
            </button>
          </div>
        )}
      </main>
    </div>
  );
}