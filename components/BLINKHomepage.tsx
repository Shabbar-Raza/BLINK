'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Moon, Sun, Menu, X, UserCircle, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const BlinkHomePreview = () => {
  const router = useRouter();
  const [showQuickActions, setShowQuickActions] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [courses] = useState([
    {
      id: 1,
      title: 'AP Physics',
      progress: 60,
      icon: '⚡',
      bgColor: 'bg-gradient-to-br from-purple-500 to-pink-500',
      notesPage: '/physics/notes'
    },
    {
      id: 2,
      title: 'Precalculus',
      progress: 45,
      icon: '📐',
      bgColor: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500',
      notesPage: '/precalculus'
    },
    {
      id: 3,
      title: 'AP/College Macroeconomics',
      progress: 30,
      icon: '🌍',
      bgColor: 'bg-gradient-to-br from-orange-500 to-yellow-500',
      notesPage: '/courses/macroeconomics'
    }
  ]);

  const [recentTopics] = useState([
    {
      id: 1,
      title: 'Two-dimensional Motion',
      subject: 'AP Physics',
      lastOpened: '2 hours ago',
      icon: '⚡',
      link: '/physics/two-dimensional-motion'
    },
    {
      id: 2,
      title: 'Derivatives',
      subject: 'Calculus BC',
      lastOpened: '5 hours ago',
      icon: '📈'
    },
    {
      id: 3,
      title: 'Supply and Demand',
      subject: 'Macroeconomics',
      lastOpened: '5 hours ago',
      icon: '📊'
    }
  ]);

  const [subjects] = useState([
    { id: 1, name: 'Physics', icon: '⚡' },
    { id: 2, name: 'Statistics', icon: '📈' },
    { id: 3, name: 'Chemistry', icon: '🧪' }
  ]);

  const QuickActionMenu = () => (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => setShowQuickActions(false)}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-xl p-4 flex gap-4 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center"
          onClick={() => {
            setShowQuickActions(false);
            router.push('/create-course');
          }}
        >
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-1">
            <span className="text-2xl">📚</span>
          </div>
          <span className="text-xs">Course</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-1">
            <span className="text-2xl">📝</span>
          </div>
          <span className="text-xs">Notes</span>
        </motion.button>
      </motion.div>
    </>
  );

  const Sidebar = () => (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
        onClick={() => setIsSidebarOpen(false)}
      />
      
      {/* Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50"
      >
        {/* Close button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 
            flex items-center justify-center"
        >
          <X className="h-5 w-5 text-gray-600" />
        </motion.button>

        {/* Profile Section */}
        <div className="pt-12 px-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-emerald-400 to-emerald-500 p-6 rounded-2xl"
          >
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm 
                  flex items-center justify-center"
              >
                <UserCircle className="w-10 h-10 text-white" />
              </motion.div>
              <div>
                <h3 className="font-semibold text-white">User Name</h3>
                <p className="text-sm text-emerald-50">user@example.com</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Menu Items */}
        <div className="mt-8 px-4">
          {[
            { 
              icon: UserCircle, 
              label: 'Profile', 
              href: '/profile',
              bgColor: 'bg-purple-100',
              iconColor: 'text-purple-600'
            },
            { 
              icon: Settings, 
              label: 'Settings', 
              href: '/settings',
              bgColor: 'bg-blue-100',
              iconColor: 'text-blue-600'
            },
            { 
              icon: HelpCircle, 
              label: 'Help', 
              href: '/help',
              bgColor: 'bg-orange-100',
              iconColor: 'text-orange-600'
            },
            { 
              icon: LogOut, 
              label: 'Logout', 
              href: '/logout',
              bgColor: 'bg-red-100',
              iconColor: 'text-red-600'
            },
          ].map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={item.href}
                className="flex items-center gap-4 p-4 rounded-xl mb-2 
                  hover:bg-gray-50 transition-colors"
              >
                <div className={`w-10 h-10 ${item.bgColor} rounded-xl 
                  flex items-center justify-center`}>
                  <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <span className="font-medium text-gray-700">
                  {item.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="absolute bottom-8 left-4 right-4">
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">💡</span>
              </div>
              <p className="text-sm text-gray-600">
                Need help? Check out our guides and tutorials
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );

  return (
    <div className="w-full h-screen flex flex-col relative">
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-4 flex justify-between items-center sticky top-0 z-10 border-b`}>
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSidebarOpen(true)}
            className={`w-10 h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full flex items-center justify-center`}
          >
            <Menu className={isDarkMode ? 'text-white' : 'text-gray-800'} />
          </motion.button>
          
          {/* BLINK Logo with Neural Network */}
          <div className="relative flex items-center">
            {/* Neural Network Background */}
            <div className="absolute -left-4 -top-4 w-32 h-16">
              {/* Neural Nodes */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-emerald-400"
                  style={{
                    left: `${(i % 3) * 40}%`,
                    top: `${Math.floor(i / 3) * 80}%`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}

              {/* Neural Connections */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`line-${i}`}
                  className="absolute h-[1px] bg-gradient-to-r from-emerald-400/50 to-teal-400/50"
                  style={{
                    width: '40%',
                    left: `${(i % 2) * 30}%`,
                    top: `${Math.floor(i / 2) * 30}%`,
                    transform: `rotate(${45 + (i * 45)}deg)`,
                    transformOrigin: 'left center'
                  }}
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                    scaleX: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut"
                  }}
                />
              ))}

              {/* Data Pulses */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`pulse-${i}`}
                  className="absolute w-1 h-1 rounded-full bg-emerald-400"
                  animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                    opacity: [0, 1, 0],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                  style={{
                    left: `${(i % 2) * 50}%`,
                    top: `${Math.floor(i / 2) * 50}%`,
                  }}
                />
              ))}
            </div>

            {/* BLINK Text */}
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold z-10"
            >
              <span className="relative">
                {/* Individual letters with neural glow effect */}
                {'BLINK'.split('').map((letter, index) => (
                  <motion.span
                    key={index}
                    className="inline-block relative bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent"
                    animate={{
                      textShadow: [
                        '0 0 5px rgba(16, 185, 129, 0)',
                        '0 0 10px rgba(16, 185, 129, 0.3)',
                        '0 0 5px rgba(16, 185, 129, 0)'
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.1,
                      ease: "easeInOut"
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
                <span className="text-xs font-normal ml-1 text-gray-400">beta</span>
              </span>
            </motion.h1>

            {/* Active Node Highlights */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`highlight-${i}`}
                className="absolute"
                style={{
                  top: -4 + (i * 3),
                  right: -4 + (i * 3),
                  width: '4px',
                  height: '4px'
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.8, 1.2, 0.8],
                  boxShadow: [
                    '0 0 2px rgba(16, 185, 129, 0.3)',
                    '0 0 4px rgba(16, 185, 129, 0.6)',
                    '0 0 2px rgba(16, 185, 129, 0.3)'
                  ]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              >
                <div className="w-full h-full rounded-full bg-emerald-400" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Rest of header content */}
        <div className="flex gap-3">
          <Link href="/chat">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-emerald-600"
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
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {/* My Courses Section */}
        <div className="py-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">My Courses</h2>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 bg-emerald-100 rounded-2xl flex items-center justify-center"
            >
              <span className="text-xl text-emerald-600">+</span>
            </motion.button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
            {courses.map((course) => (
              <Link 
                key={course.id} 
                href={course.notesPage}
                className="flex-shrink-0 w-44"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(course.notesPage);
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`h-44 ${course.bgColor} rounded-2xl relative p-4 cursor-pointer`}
                >
                  <div className="absolute top-2 left-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
                    {course.progress}%
                  </div>
                  <div className="absolute bottom-2 right-2 text-2xl">
                    {course.icon}
                  </div>
                  <div className="absolute bottom-2 left-2 text-white font-medium text-sm">
                    {course.title}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recently Opened Section */}
        <div className="px-0 mt-8 scroll-snap-align-start">
          <h2 className={`text-lg font-bold mb-4 px-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Topics
          </h2>
          <div className="space-y-2 px-0.2">
            {recentTopics.map((topic) => (
              <Link
                key={topic.id}
                href={topic.link || '#'}
                className={`block py-3 px-5 ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                } rounded-2xl shadow-sm transition-colors w-full`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{topic.icon}</span>
                  <div className="flex-1">
                    <h3 className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {topic.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {topic.subject} • {topic.lastOpened}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* My Problems Section */}
        <div className="py-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">My Problems</h2>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 bg-emerald-100 rounded-2xl flex items-center justify-center"
            >
              <span className="text-xl text-emerald-600">+</span>
            </motion.button>
          </div>

          <div className="bg-emerald-100 rounded-2xl p-4 mb-4">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-white rounded-xl flex items-center justify-center mr-2">
                <span className="text-emerald-600">+</span>
              </div>
              <span className="text-sm text-gray-600">Get homework help</span>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4">
            {subjects.map((subject) => (
              <motion.div
                key={subject.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center bg-emerald-100 px-4 py-2 rounded-xl whitespace-nowrap"
              >
                <span className="mr-1">{subject.icon}</span>
                <span className="text-sm text-gray-600">{subject.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 flex justify-around items-center p-4 border-t ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      } z-50`}>
        <motion.button 
          whileTap={{ scale: 0.95 }} 
          className={isDarkMode ? 'text-purple-400' : 'text-emerald-600'}
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
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`${isDarkMode ? 'bg-purple-900/50 text-purple-400' : 'bg-emerald-100 text-emerald-600'} rounded-2xl p-2`}
          onClick={() => setShowQuickActions(!showQuickActions)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-8 w-8 transition-transform duration-300 text-emerald-600 ${
              showQuickActions ? 'rotate-45' : ''
            }`}
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

        <motion.button 
          whileTap={{ scale: 0.95 }} 
          onClick={toggleDarkMode}
          className={isDarkMode ? 'text-purple-400' : 'text-emerald-600'}
        >
          {isDarkMode ? (
            <Sun className="h-6 w-6" />
          ) : (
            <Moon className="h-6 w-6" />
          )}
        </motion.button>
      </div>

      {showQuickActions && <QuickActionMenu />}
      {isSidebarOpen && <Sidebar />}
    </div>
  );
};

export default BlinkHomePreview;