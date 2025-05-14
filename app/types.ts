export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct answer
}

export interface Quiz {
  id: string;
  topicId: string;
  questions: QuizQuestion[];
  createdAt: Date;
}

export interface PerformanceMetrics {
  quickestAnswer: number;
  slowestAnswer: number;
  averageTime: number;
  consistencyScore: number;
  strengthAreas: string[];
  improvementAreas: string[];
}

export interface QuestionAnalytics {
  questionNumber: number;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface QuizAttempt {
  id: string;
  timestamp: string;
  score: number;
  performanceMetrics: {
    averageTime: number;
    consistencyScore: number;
    strengthAreas: string[];
    improvementAreas: string[];
    quickestAnswer: number;
    slowestAnswer: number;
  };
  analytics: QuestionAnalytics[];
  topicTitle?: string;
}

export interface SavedNote {
  id: string;
  content: string;
  timestamp: Date;
  version: number;
}

export interface Topic {
  _id: string;
  courseId: string;
  title: string;
  subtopics?: string[];
  fileType?: string;
  fileUrl?: string;
  fileId?: string;
  content?: string;
  generatedNotes?: string;
  savedNotes?: SavedNote[];
  chatSessions?: { id: string; messages: any[] }[];
  quizAttempts?: QuizAttempt[];
  created_at: Date;
} 