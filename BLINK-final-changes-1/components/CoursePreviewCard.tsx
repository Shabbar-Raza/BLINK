import React from 'react';
import { Home, Plus, UserCircle, X } from 'lucide-react';
import CoursePreviewCard from './CoursePreviewCard';
import Link from 'next/link';

const MobileInterface = () => {
  return (
    <div className="bg-gray-100 min-h-screen relative">
      {/* Header Section */}
      <header className="p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">My Courses</h1>
          <button className="bg-gray-200 rounded-full p-2">
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Modal */}
      <div className="mx-4 bg-white rounded-xl shadow-lg">
        <div className="flex justify-end p-2">
          <button className="flex items-center gap-1 px-3 py-1 rounded-full">
            <X className="h-4 w-4" />
            <span>Close</span>
          </button>
        </div>

        {/* Course Creation Options */}
        <div className="p-4 space-y-4">
          {/* Option 1: Start from prompt */}
          <div className="flex items-center gap-4">
            <div className="bg-pink-400 p-3 rounded-full">
              <span className="text-white text-xl">≡</span>
            </div>
            <div>
              <h3 className="font-medium">Start from a prompt</h3>
              <p className="text-gray-500 text-sm">Quick course setup</p>
            </div>
          </div>

          {/* Option 2: Start from document */}
          <div className="flex items-center gap-4">
            <div className="bg-pink-400 p-3 rounded-full">
              <span className="text-white text-xl">‖</span>
            </div>
            <div>
              <h3 className="font-medium">Start from a document</h3>
              <p className="text-gray-500 text-sm">Upload syllabus or notes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Courses Section */}
      <div className="px-4 mt-6">
        <h2 className="text-xl font-bold mb-3">Suggested Courses</h2>
        <div className="grid grid-cols-2 gap-4">
          <CoursePreviewCard
          //href="/courses/precalculus"
          //title="Precalculus"
          //image="/math.jpg"
          />
          <CoursePreviewCard
          //href="/courses/geometry"
          //title="Geometry"
          //image="/geometry.jpg"
          />
        </div>
      </div>

      {/* Chat Input */}
      <div className="fixed bottom-16 left-0 right-0 px-4">
        <input
          type="text"
          placeholder="Ask anything..."
          className="w-full p-3 rounded-full border border-gray-200 focus:outline-none"
        />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-4">
        <Link href="/home">
          <Home className="h-6 w-6" />
        </Link>
        <Link href="/create">
          <Plus className="h-6 w-6" />
        </Link>
        <Link href="/profile">
          <UserCircle className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
};

export default MobileInterface;
