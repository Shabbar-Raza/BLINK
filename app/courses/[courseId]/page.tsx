'use client';
import React, { useState, useEffect } from 'react';
import { ChevronDown, BookOpen, ArrowLeft, Upload, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

export default function CourseDetail({ params }: { params: { courseId: string } }) {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${params.courseId}`);
        const data = await response.json();
        setCourse(data.course);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [params.courseId]);

  const refreshCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${params.courseId}`);
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
    formData.append('courseId', params.courseId);

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
          courseId: params.courseId,
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
    window.open('http://172.16.76.83:8501/', '_blank');
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
      <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} px-4 py-3 border-b`}>
        <Link href="/" className={`inline-flex items-center gap-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} text-sm`}>
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
      </header>

      {/* Course Content */}
      <div className="flex-1 overflow-y-auto">
        <div className={`relative h-48 ${course.bgColor}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">{course.icon}</span>
          </div>
        </div>

        <div className="px-6 py-6 pb-20">
          <div className="flex items-center justify-between mb-6">
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {course.title}
            </h1>
            <label className="cursor-pointer">
              <Upload className="h-5 w-5 text-gray-600" />
              <input
                type="file"
                className="hidden"
                accept=".pdf,.ppt,.pptx,.doc,.docx"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          <div className="space-y-2">
            {course.topics?.map((topic, index) => (
              <div 
                key={index}
                className={`w-full p-4 ${
                  isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-50 text-gray-900'
                } rounded-lg relative group`}
              >
                <button
                  onClick={() => handleTopicClick(topic)}
                  className="w-full text-left"
                >
                  <h3 className="font-medium">{topic.title}</h3>
                  {topic.fileType && (
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Uploaded file: {topic.fileType}
                    </p>
                  )}
                </button>
                <button
                  onClick={() => handleDeleteTopic(topic._id)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleAddTopic}
            className="bg-white rounded-xl p-6 w-full max-w-sm"
          >
            <h3 className="text-lg font-semibold mb-4">Add New Topic</h3>
            <input
              type="text"
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4"
              placeholder="Topic title"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddTopic(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg"
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