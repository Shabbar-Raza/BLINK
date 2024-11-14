'use client'; // Add this at the top for Next.js 13+

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const BlinkHomePreview = () => {
  const [subjects] = useState([
    { id: 1, name: 'Physics', icon: '⚡' },
    { id: 2, name: 'Statistics', icon: '📈' },
    { id: 3, name: 'Chemistry', icon: '🧪' },
  ]);

  const [courses] = useState([
    {
      id: 1,
      title: 'AP/College ',
      bgColor: 'from-purple-600 to-orange-500',
      icon: '📊',
      progress: 45,
    },
    {
      id: 2,
      title: 'AP/College Macroeconomics',
      bgColor: 'from-teal-600 to-yellow-400',
      icon: '🌍',
      progress: 30,
    },
    {
      id: 3,
      title: 'AP Physics',
      bgColor: 'from-blue-500 to-purple-500',
      icon: '⚡',
      progress: 60,
    },
  ]);

  const [recentTopics] = useState([
    {
      id: 1,
      title: 'Derivatives',
      subject: 'Calculus BC',
      lastOpened: '2 hours ago',
      icon: '📈',
    },
    {
      id: 2,
      title: 'Supply and Demand',
      subject: 'Macroeconomics',
      lastOpened: '5 hours ago',
      icon: '📊',
    },
  ]);

  return (
    <div className="w-full h-screen bg-white overflow-hidden flex flex-col">
      {/* Status Bar */}
      <div className="bg-white p-2 flex justify-between items-center text-xs text-gray-600 border-b">
        <div>4:25</div>
        <div className="flex items-center gap-3">
          <span>27.0 KB/s</span>
          <span>74%</span>
        </div>
      </div>

      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Home</h1>
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* My Courses Section */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">My Courses</h2>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <span className="text-xl text-gray-600">+</span>
            </motion.button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4">
            {courses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0 w-48"
              >
                <div
                  className={`h-48 bg-gradient-to-br ${course.bgColor} rounded-xl relative mb-2 p-4`}
                >
                  <div className="absolute top-2 left-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
                    {course.progress}%
                  </div>
                  <div className="absolute bottom-2 right-2 text-3xl">
                    {course.icon}
                  </div>
                  <div className="absolute bottom-2 left-2 text-white font-medium">
                    {course.title}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recently Opened Section */}
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Recently Opened</h2>
          <div className="space-y-3">
            {recentTopics.map((topic) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xl">{topic.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{topic.title}</h3>
                    <p className="text-sm text-gray-500">{topic.subject}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {topic.lastOpened}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* My Problems Section */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">My Problems</h2>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <span className="text-xl text-gray-600">+</span>
            </motion.button>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                <span className="text-gray-600">+</span>
              </div>
              <span className="text-gray-600">Get homework help</span>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4">
            {subjects.map((subject) => (
              <motion.div
                key={subject.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center bg-gray-100 px-4 py-2 rounded-full whitespace-nowrap"
              >
                <span className="mr-1">{subject.icon}</span>
                <span className="text-gray-600">{subject.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-around items-center p-4 border-t border-gray-200 bg-white">
        <motion.button whileTap={{ scale: 0.95 }} className="text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="bg-gray-100 rounded-full p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </motion.button>
        <motion.button whileTap={{ scale: 0.95 }} className="text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </motion.button>
      </div>
    </div>
  );
};

export default BlinkHomePreview;
