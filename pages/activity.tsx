import { useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { 
  Clock, 
  BookOpen, 
  BarChart2, 
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const ActivityPage = () => {
  const [timeframe, setTimeframe] = useState('week');

  // Mock data - replace with real data from your backend
  const totalHoursSpent = 47;
  const coursesCompleted = 3;
  const averageScore = 85;
  
  const courseAnalytics = [
    { 
      name: "Horse Care Basics", 
      timeSpent: 15, 
      progress: 80,
      trend: "up",
      lastAccessed: "2 days ago"
    },
    { 
      name: "Advanced Riding", 
      timeSpent: 12, 
      progress: 60,
      trend: "down",
      lastAccessed: "1 day ago"
    },
    // Add more courses as needed
  ];

  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Hours Spent',
      data: [4, 3, 5, 2, 6, 4, 3],
      borderColor: 'rgb(99, 102, 241)',
      tension: 0.4,
    }]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Activity Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your learning progress and course engagement
          </p>
        </div>

        {/* Time frame selector */}
        <div className="flex gap-2 mb-6">
          {['week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${timeframe === period 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Time Spent"
            value={`${totalHoursSpent}h`}
            icon={<Clock className="w-6 h-6" />}
            trend="+12%"
          />
          <StatsCard
            title="Courses Completed"
            value={coursesCompleted}
            icon={<BookOpen className="w-6 h-6" />}
            trend="+1"
          />
          <StatsCard
            title="Average Score"
            value={`${averageScore}%`}
            icon={<BarChart2 className="w-6 h-6" />}
            trend="+5%"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Time Spent This Week
            </h3>
            <Line data={lineChartData} options={{ responsive: true }} />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Course Distribution
            </h3>
            <Pie 
              data={{
                labels: courseAnalytics.map(course => course.name),
                datasets: [{
                  data: courseAnalytics.map(course => course.timeSpent),
                  backgroundColor: ['#818cf8', '#34d399'],
                }]
              }}
              options={{ responsive: true }}
            />
          </div>
        </div>

        {/* Course Analytics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold p-6 border-b border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white">
            Course Analytics
          </h3>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {courseAnalytics.map((course, index) => (
              <div key={index} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {course.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {course.lastAccessed}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Time Spent</p>
                    <p className="font-medium text-gray-900 dark:text-white">{course.timeSpent}h</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">{course.progress}%</span>
                      {course.trend === 'up' ? (
                        <ArrowUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
}

const StatsCard = ({ title, value, icon, trend }: StatsCardProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
        {icon}
      </div>
      <span className={`text-sm font-medium ${
        trend.startsWith('+') ? 'text-green-500' : 'text-red-500'
      }`}>
        {trend}
      </span>
    </div>
    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
      {title}
    </h3>
    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
      {value}
    </p>
  </div>
);

export default ActivityPage; 