import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, Trophy, Target, BookOpen, BrainCircuit, ArrowLeft, 
  ChevronDown, FileUp, Folder, Zap, Book, BarChart3, TrendingUp 
} from 'lucide-react';
import { QuizAttempt } from '../types';

interface QuizAnalyticsProps {
  attempts: QuizAttempt[];
  isDarkMode: boolean;
  onClose: () => void;
}

export default function QuizAnalytics({ attempts, isDarkMode, onClose }: QuizAnalyticsProps) {
  const [selectedAttemptId, setSelectedAttemptId] = React.useState<string | null>(null);
  const [selectedView, setSelectedView] = React.useState<'overview' | 'details'>('overview');

  // Calculate overall statistics with null checks
  const totalAttempts = attempts.length;
  const averageScore = totalAttempts > 0 
    ? attempts.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalAttempts 
    : 0;
  const totalTimeSpent = attempts.reduce((acc, curr) => 
    acc + ((curr.performanceMetrics?.averageTime || 0) * (curr.analytics?.length || 1)), 0);
  const bestScore = totalAttempts > 0 
    ? Math.max(...attempts.map(a => a.score || 0)) 
    : 0;

  // Mock data for demonstration (replace with real data from your API)
  const mockStats = {
    totalCourses: 5,
    totalFiles: 12,
    totalTopics: 24,
    studyStreak: 7,
    recentActivity: [
      { date: '2024-03-20', value: 85 },
      { date: '2024-03-21', value: 92 },
      { date: '2024-03-22', value: 78 },
      { date: '2024-03-23', value: 95 },
      { date: '2024-03-24', value: 88 },
    ],
    topPerformingSubjects: [
      { subject: 'Physics', score: 92 },
      { subject: 'Mathematics', score: 88 },
      { subject: 'Chemistry', score: 85 },
    ],
  };

  const formatTime = (ms: number): string => {
    if (!ms) return '0m';
    const minutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-3 py-3 flex items-center justify-between`}>
        <div className="flex items-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="mr-3"
          >
            <ArrowLeft className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </motion.button>
          <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Learning Analytics</h1>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedView('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedView === 'overview'
                ? isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'
                : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Overview
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedView('details')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedView === 'details'
                ? isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'
                : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Quiz Details
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-3 py-4 space-y-4">
        {selectedView === 'overview' ? (
          <>
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                    <Book className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Courses</p>
                    <p className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {mockStats.totalCourses}
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
                    <FileUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Files Uploaded</p>
                    <p className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {mockStats.totalFiles}
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-emerald-900/20' : 'bg-emerald-50'}`}>
                    <Folder className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Topics</p>
                    <p className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {mockStats.totalTopics}
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
                    <Zap className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Study Streak</p>
                    <p className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {mockStats.studyStreak} days
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recent Activity Chart */}
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Recent Activity
                  </h3>
                  <BarChart3 className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <div className="h-48 flex items-end justify-between gap-2">
                  {mockStats.recentActivity.map((day, index) => (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className={`w-full rounded-t-lg ${isDarkMode ? 'bg-purple-500/30' : 'bg-purple-500'}`}
                        style={{ height: `${day.value}%` }}
                      ></div>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Performing Subjects */}
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Top Performing Subjects
                  </h3>
                  <TrendingUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <div className="space-y-4">
                  {mockStats.topPerformingSubjects.map((subject, index) => (
                    <div key={subject.subject} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {subject.subject}
                        </span>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {subject.score}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                          style={{ width: `${subject.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
              <div className="flex items-center gap-2 mb-4">
                <BrainCircuit className="w-5 h-5 text-purple-600" />
                <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  AI Learning Insights
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
                  <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                    Learning Pattern Analysis
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Your best performance occurs during evening hours (6-9 PM). Consider scheduling important study sessions during this peak time.
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                  <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Improvement Suggestions
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Based on your quiz patterns, focusing on theoretical concepts before practical applications could improve your understanding.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Quiz Details View (Original Quiz Analytics Content)
          <div className="space-y-4">
            {/* Quick Stats */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className={`${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'} p-3 rounded-lg`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Time</span>
                  </div>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatTime(totalTimeSpent)}
                  </p>
                </div>
                <div className={`${isDarkMode ? 'bg-emerald-900/20' : 'bg-emerald-50'} p-3 rounded-lg`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-emerald-600" />
                    <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Avg Score</span>
                  </div>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {averageScore.toFixed(1)}%
                  </p>
                </div>
                <div className={`${isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'} p-3 rounded-lg`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-purple-600" />
                    <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Best Score</span>
                  </div>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {bestScore.toFixed(1)}%
                  </p>
                </div>
                <div className={`${isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50'} p-3 rounded-lg`}>
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-orange-600" />
                    <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Attempts</span>
                  </div>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {totalAttempts}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Attempts List */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
              <h3 className={`text-base font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Recent Attempts
              </h3>
              <div className="space-y-3">
                {attempts.map((attempt, index) => (
                  <div 
                    key={attempt.id}
                    className={`${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border rounded-lg`}
                  >
                    <div className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {attempt.topicTitle || `Attempt ${attempts.length - index}`}
                          </h4>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date(attempt.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded-lg text-sm ${
                          attempt.score >= 90 ? 'bg-green-100 text-green-700' :
                          attempt.score >= 80 ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {(attempt.score || 0).toFixed(1)}%
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Time Spent</p>
                          <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {formatTime((attempt.performanceMetrics?.averageTime || 0) * (attempt.analytics?.length || 1))}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Consistency</p>
                          <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {(attempt.performanceMetrics?.consistencyScore || 0).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => setSelectedAttemptId(selectedAttemptId === attempt.id ? null : attempt.id)}
                      className={`w-full px-3 py-2 flex items-center justify-center gap-2 border-t ${
                        isDarkMode 
                          ? 'border-gray-700 text-gray-300 hover:bg-gray-700' 
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {selectedAttemptId === attempt.id ? 'Hide Details' : 'View Details'}
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform ${
                          selectedAttemptId === attempt.id ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>

                    {/* Detailed Analytics */}
                    {selectedAttemptId === attempt.id && (
                      <div className={`p-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="space-y-3">
                          {attempt.analytics?.map((question, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-lg ${
                                isDarkMode 
                                  ? question.isCorrect ? 'bg-green-900/20' : 'bg-red-900/20'
                                  : question.isCorrect ? 'bg-green-50' : 'bg-red-50'
                              }`}
                            >
                              <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Question {question.questionNumber}
                              </p>
                              <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {question.question}
                              </p>
                              <div className="space-y-1">
                                <p className={`text-xs ${
                                  question.isCorrect 
                                    ? isDarkMode ? 'text-green-400' : 'text-green-600'
                                    : isDarkMode ? 'text-red-400' : 'text-red-600'
                                }`}>
                                  Your answer: {question.selectedAnswer}
                                </p>
                                {!question.isCorrect && (
                                  <p className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                    Correct: {question.correctAnswer}
                                  </p>
                                )}
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Time: {formatTime(question.timeSpent)}
                                </p>
                              </div>
                            </div>
                          ))}
                          {(!attempt.analytics || attempt.analytics.length === 0) && (
                            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                No detailed analytics available for this attempt
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 