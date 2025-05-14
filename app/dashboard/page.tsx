'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserDashboard from '@/app/components/UserDashboard';
import { useTheme } from '@/contexts/ThemeContext';

interface Analytics {
  statistics: {
    totalCourses: number;
    totalFiles: number;
    totalTopics: number;
    studyStreak: number;
    averageScore: number;
    bestScore: number;
    totalAttempts: number;
  };
  recentActivity: Array<{ date: string; value: number }>;
  recentAttempts: any[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading || !analytics) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <UserDashboard
      attempts={analytics.recentAttempts}
      isDarkMode={isDarkMode}
      onClose={() => router.push('/')}
      userData={{
        totalCourses: analytics.statistics.totalCourses,
        totalFiles: analytics.statistics.totalFiles,
        totalTopics: analytics.statistics.totalTopics,
        studyStreak: analytics.statistics.studyStreak,
        recentActivity: analytics.recentActivity,
        topPerformingSubjects: []
      }}
    />
  );
} 