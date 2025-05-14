import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, Trophy, Target, BookOpen, BrainCircuit, ArrowLeft, 
  ChevronDown, FileUp, Folder, Zap, Book, BarChart3, TrendingUp 
} from 'lucide-react';
import { QuizAttempt } from '../types';

interface UserDashboardProps {
  attempts: QuizAttempt[];
  isDarkMode: boolean;
  onClose: () => void;
  userData: {
    totalCourses: number;
    totalFiles: number;
    totalTopics: number;
    studyStreak: number;
    recentActivity: Array<{ date: string; value: number }>;
    topPerformingSubjects: Array<{ subject: string; score: number }>;
  };
}

export default function UserDashboard({ attempts, isDarkMode, onClose, userData }: UserDashboardProps) {
  const [selectedView, setSelectedView] = React.useState<'overview' | 'details'>('overview');

  // Calculate overall statistics
  const totalAttempts = attempts.length;
  const averageScore = totalAttempts > 0 
    ? attempts.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalAttempts 
    : 0;
  const bestScore = totalAttempts > 0 
    ? Math.max(...attempts.map(a => a.score || 0)) 
    : 0;

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
      <div className={`sticky top-0 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 py-4 flex items-center justify-between`}>
        <div className="flex items-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="mr-3"
          >
            <ArrowLeft className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </motion.button>
          <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Learning Dashboard
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                <Book className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Total Courses
                </p>
                <p className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userData.totalCourses}
                </p>
              </div>
            </div>
            <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                style={{ width: `${(userData.totalCourses / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
                <FileUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Files Uploaded
                </p>
                <p className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userData.totalFiles}
                </p>
              </div>
            </div>
            <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 rounded-full transition-all duration-500" 
                style={{ width: `${(userData.totalFiles / 20) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-emerald-900/20' : 'bg-emerald-50'}`}>
                <Trophy className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Best Score
                </p>
                <p className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {bestScore.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${bestScore}%` }}
              ></div>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Study Streak
                </p>
                <p className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userData.studyStreak} days
                </p>
              </div>
            </div>
            <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-500" 
                style={{ width: `${(userData.studyStreak / 7) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activity Chart */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Recent Activity
              </h3>
              <BarChart3 className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {userData.recentActivity.map((day, index) => (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isDarkMode ? 'bg-purple-500/30' : 'bg-purple-500'
                    }`}
                    style={{ height: `${day.value}%` }}
                  ></div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Quiz Attempts */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Recent Quiz Attempts
              </h3>
              <Target className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <div className="space-y-4">
              {attempts.slice(0, 3).map((attempt, index) => (
                <div key={attempt.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Quiz Attempt {attempts.length - index}
                      </span>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(attempt.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-sm ${
                      attempt.score >= 90 ? 'bg-green-100 text-green-700' :
                      attempt.score >= 80 ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {attempt.score}%
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${attempt.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
          <div className="flex items-center gap-2 mb-6">
            <BrainCircuit className="w-6 h-6 text-purple-600" />
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              AI Learning Insights
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
              <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                Learning Pattern Analysis
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your performance peaks during evening hours (6-9 PM). Consider scheduling important study sessions during this time for optimal results.
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
      </div>
    </div>
  );
} 