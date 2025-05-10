'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, BookOpen, Brain } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';

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
      flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
      ${active 
        ? 'bg-blue-600 text-white' 
        : isDarkMode
          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }
    `}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default function TopicPage() {
  const params = useParams();
  const { isDarkMode } = useTheme();
  const [topic, setTopic] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('view');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopic = async () => {
      const topicId = params?.topicId as string;
      if (!topicId) return;

      try {
        const response = await fetch(`/api/topics/${topicId}`);
        const data = await response.json();
        setTopic(data.topic);
      } catch (error) {
        console.error('Error fetching topic:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [params?.topicId]);

  if (loading) return <div>Loading...</div>;
  if (!topic) return <div>Topic not found</div>;

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
          <h1 className={`text-2xl font-bold mt-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {topic.title}
          </h1>
          
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
            {topic.fileUrl ? (
              <div className="p-4 bg-gray-50 rounded-lg">
                <a href={topic.fileUrl} className="text-blue-600 hover:underline">
                  View Document
                </a>
              </div>
            ) : (
              <p className="text-gray-500">No materials uploaded yet</p>
            )}
          </div>
        )}
        
        {activeTab === 'notes' && (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Study Notes
            </h2>
            {/* Add notes content here */}
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