'use client';
import React, { useState, useEffect } from 'react';
import { ChevronDown, BookOpen, ArrowLeft, Upload, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';

interface Topic {
  _id: string;
  title: string;
  subtopics: string[];
  fileUrl?: string;
  fileType?: string;
}

interface Course {
  _id: string;
  title: string;
  icon: string;
  bgColor: string;
  topics: Topic[];
}

export default function CourseDetail() {
  const params = useParams();
  const courseId = (params?.courseId as string) || '';
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`);
        const data = await response.json();
        if (data.course) {
          setCourse(data.course);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const refreshCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      const data = await response.json();
      setCourse(data.course);
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('courseId', courseId);

    try {
      const response = await fetch('/api/topics/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        refreshCourse(); // Use refreshCourse instead of fetchCourse
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;

    try {
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: courseId,
          title: newTopicTitle,
          subtopics: []
        }),
      });

      if (response.ok) {
        setNewTopicTitle('');
        setShowAddTopic(false);
        refreshCourse(); // Refresh course data
      }
    } catch (error) {
      console.error('Error adding topic:', error);
    }
  };

  const handleTopicClick = (topic: Topic) => {
    router.push(`/topics/${topic._id}`);
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!window.confirm('Are you sure you want to delete this topic?')) return;

    try {
      const response = await fetch(`/api/topics/${topicId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        refreshCourse(); // Refresh to show updated topics list
      }
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="h-screen max-w-md mx-auto flex flex-col overflow-hidden">
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} sticky top-0 z-10 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="max-w-md mx-auto">
          <div className="px-4 py-4">
            {/* Top navigation and title section */}
            <div className="flex items-center justify-between mb-4">
              <Link 
                href="/" 
                className={`inline-flex items-center gap-2 ${
                  isDarkMode ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                } text-sm font-medium transition-colors`}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Courses</span>
              </Link>
              
              <div className="flex items-center gap-3">
                <label className={`p-2 rounded-lg cursor-pointer transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}>
                  <Upload className="h-5 w-5" />
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.ppt,.pptx,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>

            {/* Course title section */}
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${course.bgColor}`}>
                <span className="text-2xl">{course.icon}</span>
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {course.title}
                </h1>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {course.topics?.length || 0} Topics
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Course Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 pb-20">
          <div className="space-y-2">
            {course.topics?.map((topic, index) => (
              <div 
                key={index}
                className={`w-full p-4 ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                } rounded-lg relative group transition-all duration-200 shadow-sm border ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-100'
                }`}
              >
                <button
                  onClick={() => handleTopicClick(topic)}
                  className="w-full text-left flex items-center gap-3"
                >
                  <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <BookOpen className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">{topic.title}</h3>
                    {topic.fileType && (
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {topic.fileType.toUpperCase()} Document
                      </p>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => handleDeleteTopic(topic._id)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-full"
                >
                  <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Topic Form */}
      {showAddTopic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <form 
            onSubmit={handleAddTopic}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-sm shadow-xl`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Add New Topic
            </h3>
            <input
              type="text"
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200'
              } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              placeholder="Enter topic title"
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowAddTopic(false)}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Topic
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Footer Button */}
      <div className="bg-purple-600 h-14 flex-shrink-0">
        <button 
          onClick={() => setShowAddTopic(true)}
          className="w-full h-full flex items-center justify-center gap-2 text-white text-sm font-medium"
        >
          <BookOpen className="h-4 w-4" />
          Add New Topic
        </button>
      </div>
    </div>
  );
} 