'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QuizAnalytics from '@/app/components/QuizAnalytics';
import { useTheme } from '@/contexts/ThemeContext';
import { QuizAttempt } from '@/app/types';

export default function QuizAnalyticsPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllAttempts = async () => {
      try {
        // Fetch all quiz attempts across all topics
        const response = await fetch('/api/quiz-attempts');
        if (!response.ok) throw new Error('Failed to fetch quiz attempts');
        const data = await response.json();
        setAttempts(data.attempts);
      } catch (error) {
        console.error('Error fetching quiz attempts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllAttempts();
  }, []);

  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <QuizAnalytics
      attempts={attempts}
      isDarkMode={isDarkMode}
      onClose={() => router.back()}
    />
  );
} 