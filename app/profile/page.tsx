'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Trophy, Target, BookOpen, BrainCircuit, LineChart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Profile() {
  const router = useRouter();

  const courseStats = [
    {
      course: "AP Physics",
      timeSpent: "24h 30m",
      quizzesTaken: 15,
      averageScore: 85,
      lastActive: "2 days ago"
    },
    {
      course: "Precalculus",
      timeSpent: "18h 45m",
      quizzesTaken: 12,
      averageScore: 92,
      lastActive: "1 day ago"
    },
    {
      course: "Macroeconomics",
      timeSpent: "12h 15m",
      quizzesTaken: 8,
      averageScore: 78,
      lastActive: "5 days ago"
    }
  ];

  const recentQuizzes = [
    {
      title: "Two-dimensional Motion",
      score: 90,
      date: "Mar 15, 2024",
      course: "AP Physics"
    },
    {
      title: "Derivatives",
      score: 85,
      date: "Mar 14, 2024",
      course: "Precalculus"
    },
    {
      title: "Supply and Demand",
      score: 95,
      date: "Mar 12, 2024",
      course: "Macroeconomics"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Fixed back button */}
      <div className="sticky top-0 bg-white border-b px-3 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <h1 className="text-lg font-semibold">My Profile</h1>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/quiz-analytics')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
        >
          <LineChart className="h-4 w-4" />
          <span className="text-sm font-medium">Quiz Analytics</span>
        </motion.button>
      </div>

      {/* Profile Content - Adjusted padding */}
      <div className="max-w-3xl mx-auto px-3 py-4 space-y-4">
        {/* Profile Overview - Reduced padding and gap */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
              MS
            </div>
            <div>
              <h2 className="text-xl font-bold">Muhammad Shabbar</h2>
              <p className="text-gray-500 text-sm">Grade 10 Student</p>
              <p className="text-gray-500 text-sm">k213265@nu.edu.pk</p>
            </div>
          </div>

          {/* Quick Stats - Adjusted grid for mobile */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-xs text-gray-600">Total Time</span>
              </div>
              <p className="text-lg font-bold text-gray-900">55h 30m</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-gray-600">Avg Score</span>
              </div>
              <p className="text-lg font-bold text-gray-900">85%</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-600">Quizzes</span>
              </div>
              <p className="text-lg font-bold text-gray-900">35</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <span className="text-xs text-gray-600">Courses</span>
              </div>
              <p className="text-lg font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        {/* Course Performance - Adjusted padding */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-base font-semibold mb-3">Course Performance</h3>
          <div className="space-y-3">
            {courseStats.map((course, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{course.course}</h4>
                  <span className="text-xs text-gray-500">Last active: {course.lastActive}</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Time Spent</p>
                    <p className="font-semibold text-sm">{course.timeSpent}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Quizzes Taken</p>
                    <p className="font-semibold text-sm">{course.quizzesTaken}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Average Score</p>
                    <p className="font-semibold text-sm">{course.averageScore}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quiz Performance - Adjusted padding */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-base font-semibold mb-3">Recent Quizzes</h3>
          <div className="space-y-2">
            {recentQuizzes.map((quiz, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm text-gray-900">{quiz.title}</h4>
                  <p className="text-xs text-gray-500">{quiz.course} • {quiz.date}</p>
                </div>
                <div className={`px-2 py-1 rounded-md text-sm ${
                  quiz.score >= 90 ? 'bg-green-100 text-green-700' :
                  quiz.score >= 80 ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {quiz.score}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Insights - Adjusted padding */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit className="w-4 h-4 text-purple-600" />
            <h3 className="text-base font-semibold">Learning Insights</h3>
          </div>
          <div className="space-y-2">
            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-sm text-gray-700">Best performing subject: <span className="font-semibold">Precalculus</span></p>
              <p className="text-xs text-gray-500">Average score of 92% across 12 quizzes</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-sm text-gray-700">Suggested focus area: <span className="font-semibold">Macroeconomics</span></p>
              <p className="text-xs text-gray-500">Recent quiz scores below your average</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 