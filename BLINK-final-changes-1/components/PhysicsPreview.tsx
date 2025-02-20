'use client';

import React from 'react';
import { ChevronDown, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '../contexts/ThemeContext';

const PhysicsPreview = () => {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  
  const topics = [
    {
      title: "Two-dimensional Motion",
      subtopics: ["Projectile Motion", "Vectors", "Relative Motion"],
      link: "/physics/two-dimensional-motion"
    },
    {
      title: "Forces and Newton's Laws",
      subtopics: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law"],
      link: "/physics/forces"
    },
    {
      title: "Energy and Work",
      subtopics: ["Kinetic Energy", "Potential Energy", "Conservation of Energy"],
      link: "/physics/energy"
    },
    {
      title: "Momentum and Collisions",
      subtopics: ["Linear Momentum", "Conservation of Momentum", "Elastic Collisions"],
      link: "/physics/momentum"
    },
    {
      title: "Circular Motion",
      subtopics: ["Uniform Circular Motion", "Centripetal Force", "Satellites"],
      link: "/physics/circular-motion"
    },
    {
      title: "Gravitation",
      subtopics: ["Newton's Law of Gravitation", "Orbital Motion", "Kepler's Laws"],
      link: "/physics/gravitation"
    }
  ];

  return (
    <div className="h-screen max-w-md mx-auto flex flex-col overflow-hidden">
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} px-4 py-3 border-b`}>
        <Link href="/" className={`inline-flex items-center gap-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} text-sm`}>
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
      </header>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Header Image */}
        <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-500">
          <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-md text-xs">
            Preview
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">⚡</span>
          </div>
        </div>

        {/* Course Content */}
        <div className="px-6 py-6 pb-20">
          <h1 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            AP Physics
          </h1>
          
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm mb-6 leading-relaxed`}>
            Master fundamental physics concepts through comprehensive study of mechanics, energy, 
            and motion. Develop problem-solving skills with real-world applications and prepare 
            for the AP Physics exam.
          </p>

          <h2 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Course Topics
          </h2>
          
          <div className="space-y-2">
            {topics.map((topic, index) => (
              <button 
                key={index}
                onClick={() => router.push(topic.link)}
                className={`w-full flex justify-between items-center p-4 ${
                  isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-50 text-gray-900'
                } rounded-lg text-left group hover:bg-emerald-50 transition-colors`}
              >
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{topic.title}</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {topic.subtopics.join(" • ")}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 group-hover:text-emerald-500" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="bg-purple-600 h-14 flex-shrink-0">
        <button className="w-full h-full flex items-center justify-center gap-2 text-white text-sm font-medium">
          <BookOpen className="h-4 w-4" />
          Add to My Courses
        </button>
      </div>
    </div>
  );
};

export default PhysicsPreview; 