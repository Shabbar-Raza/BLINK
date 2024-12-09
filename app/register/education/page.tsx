'use client';
import React from 'react';
import Image from 'next/image';

const EducationLevel = () => {
  const [selectedLevel, setSelectedLevel] = React.useState('');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center mb-6">
          <Image 
            src="/media/logo.png" 
            alt="Register" 
            width={200} 
            height={200} 
            priority 
          />
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h1 className="text-2xl font-semibold mb-2">Education Level</h1>
          <p className="text-gray-500 text-sm mb-8">What is your current level of education?</p>

          <div className="space-y-4">
            <label className="block">
              <input
                type="radio"
                name="education"
                value="primary"
                className="mr-2"
                onChange={(e) => setSelectedLevel(e.target.value)}
              />
              School Class 1-5
            </label>
            <label className="block">
              <input
                type="radio"
                name="education"
                value="secondary"
                className="mr-2"
                onChange={(e) => setSelectedLevel(e.target.value)}
              />
              School Class 6-10
            </label>
            <label className="block">
              <input
                type="radio"
                name="education"
                value="college"
                className="mr-2"
                onChange={(e) => setSelectedLevel(e.target.value)}
              />
              College
            </label>

            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-medium mt-6 ${
                selectedLevel 
                  ? 'bg-[#1e2a4a] text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!selectedLevel}
              onClick={() => {
                // Handle registration completion here
                console.log('Selected level:', selectedLevel);
                // Redirect to homepage
                window.location.href = '/';
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationLevel; 