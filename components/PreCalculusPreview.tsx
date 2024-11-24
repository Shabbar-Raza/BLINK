'use client';

import React from 'react';
import { ChevronDown, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../contexts/ThemeContext';

const PreCalculusPreview = () => {
  const { isDarkMode } = useTheme();
  
  const topics = [
    "Composite and inverse functions",
    "Trigonometry",
    "Complex numbers",
    "Rational functions",
    "Conic sections",
    "Vectors",
    "Matrices",
    "Probability and combinatorics",
    "Series",
    "Limits and continuity"
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
        <div className="relative h-48 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500">
          <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-md text-xs">
            Preview
          </div>
          <div className="absolute inset-0 flex justify-center">
            <div className="w-96 h-48 border-4 border-pink-400 rounded-t-full opacity-50"></div>
          </div>
        </div>

        {/* Course Content */}
        <div className="px-6 py-6 pb-20">
          <h1 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Precalculus
          </h1>
          
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm mb-6 leading-relaxed`}>
            Build a strong foundation in mathematical concepts, including functions, trigonometry, 
            complex numbers, and more, to prepare for advanced math and problem-solving. Explore 
            real-world applications and develop critical thinking skills.
          </p>

          <h2 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            What&apos;s covered
          </h2>
          
          <div className="space-y-2">
            {topics.map((topic, index) => (
              <button 
                key={index}
                className={`w-full flex justify-between items-center p-3 ${
                  isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-50 text-gray-900'
                } rounded-lg text-left text-sm`}
              >
                <span>{topic}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="bg-[#F15A22] h-14 flex-shrink-0">
        <button className="w-full h-full flex items-center justify-center gap-2 text-white text-sm font-medium">
          <BookOpen className="h-4 w-4" />
          Add to My Courses
        </button>
      </div>
    </div>
  );
};

export default PreCalculusPreview;
