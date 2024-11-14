import React from 'react';
import { ChevronDown, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const PreCalculusPreview = () => {
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10 px-4 py-3 border-b">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-700">
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </Link>
      </div>

      {/* Header Image */}
      <div className="relative h-48 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 mt-14">
        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-md text-sm">
          Preview
        </div>
        {/* Decorative half-circle pattern */}
        <div className="absolute inset-0 flex justify-center">
          <div className="w-96 h-48 border-4 border-pink-400 rounded-t-full opacity-50"></div>
        </div>
      </div>

      {/* Course Content */}
      <div className="px-6 py-8 pb-24">
        <h1 className="text-3xl font-bold mb-4">Precalculus</h1>
        
        <p className="text-gray-700 mb-8 leading-relaxed">
          Build a strong foundation in mathematical concepts, including functions, trigonometry, 
          complex numbers, and more, to prepare for advanced math and problem-solving. Explore 
          real-world applications and develop critical thinking skills.
        </p>

        <h2 className="text-2xl font-bold mb-4">What's covered</h2>
        
        <div className="space-y-2">
          {topics.map((topic, index) => (
            <button 
              key={index}
              className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-lg text-left"
            >
              <span>{topic}</span>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
          ))}
        </div>

        {/* Add to Courses Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <button className="w-full bg-orange-500 text-white py-4 rounded-full flex items-center justify-center gap-2">
            <BookOpen className="h-5 w-5" />
            Add to My Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreCalculusPreview;