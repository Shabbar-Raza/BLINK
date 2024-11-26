'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Moon, Sun, Menu, LogOut, Settings, User, AlertTriangle, Heart, Activity, HelpCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Archivo_Black } from 'next/font/google';

const archivoBlack = Archivo_Black({ 
  weight: '400',
  subsets: ['latin'] 
});

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
      notesPage: '/physics'
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
          onClick={() => {
            setShowQuickActions(false);
            router.push('/notes');
          }}
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
    <AnimatePresence mode="wait">
      {isSidebarOpen && (
        <>
          {/* Backdrop overlay with blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
          
          {/* Enhanced Sidebar */}
          <motion.div 
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ 
              x: "-100%",
              opacity: 0,
              transition: { 
                type: "spring",
                stiffness: 400,
                damping: 40
              }
            }}
            transition={{ 
              type: "spring",
              stiffness: 400,
              damping: 40
            }}
            className={`fixed top-0 left-0 h-full w-80 ${
              isDarkMode 
                ? 'bg-gray-900/95 backdrop-blur-lg' 
                : 'bg-white/95 backdrop-blur-lg'
            } shadow-2xl z-50 overflow-hidden`}
          >
            {/* Header with enhanced design */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-6 ${
                isDarkMode ? 'border-gray-800' : 'border-gray-100'
              } border-b relative`}
            >
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarOpen(false)}
                className={`absolute right-4 top-4 p-2 rounded-full ${
                  isDarkMode 
                    ? 'hover:bg-gray-800 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </motion.button>

              {/* User Profile Section */}
              <div className="flex items-center gap-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg"
                >
                  <User className="w-7 h-7 text-white" />
                </motion.div>
                <div>
                  <h3 className={`font-semibold text-lg ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Your Name
                  </h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Student
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Menu Items with enhanced design */}
            <motion.nav 
              initial="closed"
              animate="open"
              variants={{
                open: {
                  transition: { staggerChildren: 0.08, delayChildren: 0.3 }
                },
                closed: {
                  transition: { staggerChildren: 0.05, staggerDirection: -1 }
                }
              }}
              className="p-4 space-y-2"
            >
              {[
                { href: '/profile', icon: <User />, label: 'Profile' },
                { href: '/settings', icon: <Settings />, label: 'Settings' },
                { href: '/help', icon: <HelpCircle />, label: 'Help & Support' },
                { href: '/activity', icon: <Activity />, label: 'Activity' },
                { href: '/favorites', icon: <Heart />, label: 'Favorites' },
              ].map((item, index) => (
                <motion.div
                  key={item.href}
                  variants={{
                    open: {
                      x: 0,
                      opacity: 1,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 24
                      }
                    },
                    closed: {
                      x: -20,
                      opacity: 0
                    }
                  }}
                >
                  <Link href={item.href}>
                    <motion.div
                      whileHover={{ 
                        x: 5,
                        transition: { type: "spring", stiffness: 400 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        isDarkMode 
                          ? 'hover:bg-gray-800/80 hover:text-emerald-400' 
                          : 'hover:bg-gray-50 hover:text-emerald-600'
                      } cursor-pointer transition-colors`}
                    >
                      <span className={`w-5 h-5 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {item.icon}
                      </span>
                      <span className={`${
                        isDarkMode ? 'text-gray-100' : 'text-gray-700'
                      } font-medium`}>
                        {item.label}
                      </span>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}

              {/* Logout button with enhanced design */}
              <motion.div
                variants={{
                  open: {
                    x: 0,
                    opacity: 1,
                    transition: {
                      delay: 0.4,
                      type: "spring",
                      stiffness: 300,
                      damping: 24
                    }
                  },
                  closed: {
                    x: -20,
                    opacity: 0
                  }
                }}
                className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800"
              >
                <motion.div 
                  whileHover={{ 
                    x: 5,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    router.push('/logout');
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    isDarkMode 
                      ? 'hover:bg-red-500/10 text-red-400' 
                      : 'hover:bg-red-50 text-red-600'
                  } cursor-pointer transition-colors`}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </motion.div>
              </motion.div>
            </motion.nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div className="w-full h-screen flex flex-col relative">
      {/* Header - Updated with new logo style */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-4 flex justify-between items-center sticky top-0 z-10 border-b`}>
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => setIsSidebarOpen(true)}
            className={`p-2 rounded-lg ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-white' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <Menu className="w-6 h-6" />
          </motion.button>
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`${archivoBlack.className} text-3xl
              ${isDarkMode ? 'text-white' : 'text-black'}
            `}
            style={{
              fontWeight: 900,
              letterSpacing: '-0.02em',
            }}
          >
            BLINK
          </motion.h1>
        </div>
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