'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Play, CheckCircle } from 'lucide-react';

const PhysicsNotesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-gray-200 px-4 py-3 border-b">
        <div className="flex justify-between items-center">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-700 text-sm">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
          <Share2 className="h-4 w-4 text-gray-700" />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-lg mx-auto pt-4 px-4 pb-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600">📚</span>
          </div>
          <h1 className="text-2xl font-bold">Two-dimensional motion</h1>
        </div>

        <p className="text-gray-700 mb-8">
          Examine the principles of two-dimensional motion, including vector analysis, projectile
          motion, and the effects of forces in multiple dimensions in High School Physics.
        </p>

        {/* Unit Section */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-semibold">Unit 1, Skill 1</h2>
              <p className="text-gray-500">Two-dimensional projectile motion</p>
            </div>
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">
              Practice
            </span>
          </div>
          <button className="w-full bg-orange-500 text-white py-3 rounded-lg flex items-center justify-center gap-2">
            <Play className="h-5 w-5" />
            Resume
          </button>
        </div>

        {/* Course Proficiency */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Course Proficiency</h2>
          <div className="bg-orange-50 rounded-full h-4 mb-2">
            <div className="bg-orange-500 h-full rounded-full" style={{ width: '0%' }}></div>
          </div>
          <p className="text-right text-sm text-gray-600">0%</p>
        </div>

        {/* Course Content */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Two-dimensional motion</h3>
            <CheckCircle className="h-5 w-5 text-gray-300" />
          </div>

          <div className="space-y-4">
            <Link href="/physics/two-dimensional-motion" className="w-full">
              <button className="w-full flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                <Play className="h-5 w-5 text-orange-500" />
                <span>Two-dimensional projectile motion</span>
                <CheckCircle className="h-5 w-5 text-gray-300 ml-auto" />
              </button>
            </Link>

            <button className="w-full flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <Play className="h-5 w-5 text-orange-500" />
              <span>Optimal angle for a projectile</span>
              <CheckCircle className="h-5 w-5 text-gray-300 ml-auto" />
            </button>

            <button className="w-full flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <Play className="h-5 w-5 text-purple-500" />
              <span>Unit Quiz</span>
              <CheckCircle className="h-5 w-5 text-gray-300 ml-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicsNotesPage;