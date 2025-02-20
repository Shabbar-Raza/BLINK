import React from 'react';
import { Home, Plus, UserCircle, X } from 'lucide-react';
import Link from 'next/link';

const MobileInterface = () => {
  return (
    // Remove phone frame wrapper and use full viewport
    <div className="w-full min-h-screen bg-white relative">
      {/* Main content area */}
      <div className="h-full pb-20">
        {/* Header Section */}
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">My Courses</h1>
            <button className="bg-gray-100 rounded-full p-2">
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
        {/* Course Creation Modal */}
        <div className="mx-4 bg-white rounded-xl border">
          <div className="flex justify-end p-2">
            <button className="flex items-center gap-1 px-3 py-1">
              <X className="h-4 w-4" />
              <span>Close</span>
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-pink-400 p-3 rounded-full">
                <span className="text-white text-xl">≡</span>
              </div>
              <div>
                <h3 className="font-medium">Start from a prompt</h3>
                <p className="text-gray-500 text-sm">
                  Describe your Course in a few words
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-pink-400 p-3 rounded-full">
                <span className="text-white text-xl">‖</span>
              </div>
              <div>
                <h3 className="font-medium">Start from a document</h3>
                <p className="text-gray-500 text-sm">
                  Upload a classroom resource like a textbook, syllabus, notes,
                  or test
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* My Problems Section */}
        <div className="mx-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Problems</h2>
            <button className="bg-gray-100 rounded-full p-2">
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-3 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm">
              Q. 7 Write the following system linear equations
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Navigation - Full width */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex justify-around p-4">
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
    </div>
  );
};

export default MobileInterface;
