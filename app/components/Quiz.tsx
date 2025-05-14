import React, { useState, useEffect } from 'react';
import { QuizQuestion, PerformanceMetrics } from '../types';
import { CheckCircle2, XCircle, Clock, Brain, Target, Zap, BarChart3, Timer, History, ChevronDown } from 'lucide-react';

interface QuizProps {
  topicContent: string;
  isDarkMode: boolean;
  topicId: string;
}

interface QuestionAnalytics {
  questionNumber: number;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

interface QuizAttempt {
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
}

export default function Quiz({ topicContent, isDarkMode, topicId }: QuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [timePerQuestion, setTimePerQuestion] = useState<number[]>([]);
  const [analytics, setAnalytics] = useState<QuestionAnalytics[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);

  useEffect(() => {
    if (questions.length > 0 && score === null) {
      setQuestionStartTime(Date.now());
    }
    fetchQuizHistory();
  }, [currentQuestion, questions, topicId]);

  const fetchQuizHistory = async () => {
    try {
      const response = await fetch(`/api/topics/${topicId}/quiz-attempts`);
      if (!response.ok) throw new Error('Failed to fetch quiz history');
      const data = await response.json();
      setQuizHistory(data.attempts);
    } catch (error) {
      console.error('Error fetching quiz history:', error);
    }
  };

  const saveQuizAttempt = async (finalScore: number, questionAnalytics: QuestionAnalytics[], metrics: PerformanceMetrics) => {
    try {
      const quizAttempt = {
        questions: questions.map(q => ({
          ...q,
          id: q.id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer
        })),
        answers: selectedAnswers,
        timePerQuestion,
        score: finalScore,
        performanceMetrics: metrics,
        analytics: questionAnalytics
      };

      const response = await fetch(`/api/topics/${topicId}/quiz-attempts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizAttempt),
      });

      if (!response.ok) throw new Error('Failed to save quiz attempt');
      await fetchQuizHistory(); // Refresh history after saving
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
    }
  };

  const generateQuiz = async () => {
    try {
      setIsLoading(true);
      setError('');
      setQuestions([]);
      setSelectedAnswers([]);
      setScore(null);
      setTimePerQuestion([]);
      setAnalytics([]);
      setStartTime(Date.now());

      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: topicContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();
      setQuestions(data.questions);
      setQuestionStartTime(Date.now());
    } catch (error) {
      setError('Failed to generate quiz. Please try again.');
      console.error('Error generating quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    const timeSpent = Date.now() - questionStartTime;
    const newTimePerQuestion = [...timePerQuestion];
    newTimePerQuestion[currentQuestion] = timeSpent;
    setTimePerQuestion(newTimePerQuestion);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculatePerformanceMetrics = (): PerformanceMetrics => {
    const times = timePerQuestion.filter(t => t > 0);
    const quickestAnswer = Math.min(...times);
    const slowestAnswer = Math.max(...times);
    const averageTime = times.reduce((a, b) => a + b, 0) / times.length;

    // Calculate consistency score (lower time variance = more consistent)
    const timeVariance = times.reduce((sum, time) => sum + Math.pow(time - averageTime, 2), 0) / times.length;
    const consistencyScore = Math.max(0, 100 - (timeVariance / 1000));

    // Analyze strength and improvement areas based on time and correctness
    const questionAnalysis = questions.map((q, idx) => ({
      time: timePerQuestion[idx],
      isCorrect: selectedAnswers[idx] === q.correctAnswer,
      question: q.question
    }));

    const strengthAreas = questionAnalysis
      .filter(q => q.isCorrect && q.time < averageTime)
      .map(q => q.question.split(' ').slice(0, 5).join(' ') + '...');

    const improvementAreas = questionAnalysis
      .filter(q => !q.isCorrect || q.time > averageTime * 1.5)
      .map(q => q.question.split(' ').slice(0, 5).join(' ') + '...');

    return {
      quickestAnswer,
      slowestAnswer,
      averageTime,
      consistencyScore,
      strengthAreas: strengthAreas.slice(0, 3),
      improvementAreas: improvementAreas.slice(0, 3)
    };
  };

  const calculateScore = () => {
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    const questionAnalytics: QuestionAnalytics[] = questions.map((question, index) => ({
      questionNumber: index + 1,
      question: question.question,
      selectedAnswer: question.options[selectedAnswers[index]],
      correctAnswer: question.options[question.correctAnswer],
      isCorrect: selectedAnswers[index] === question.correctAnswer,
      timeSpent: timePerQuestion[index] || 0
    }));

    const correctAnswers = questionAnalytics.filter(q => q.isCorrect).length;
    const finalScore = (correctAnswers / questions.length) * 100;
    const metrics = calculatePerformanceMetrics();
    
    setScore(finalScore);
    setAnalytics(questionAnalytics);
    setPerformanceMetrics(metrics);
    
    // Save the attempt with complete data
    saveQuizAttempt(finalScore, questionAnalytics, metrics);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setScore(null);
    setTimePerQuestion([]);
    setAnalytics([]);
    setShowAnalytics(false);
    setPerformanceMetrics(null);
    generateQuiz();
  };

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calculateAverageTime = (): string => {
    const totalTime = timePerQuestion.reduce((acc, time) => acc + time, 0);
    return formatTime(totalTime / questions.length);
  };

  const handleViewAttemptDetails = (attemptId: string) => {
    setSelectedAttemptId(selectedAttemptId === attemptId ? null : attemptId);
  };

  if (!topicContent) {
    return (
      <div className={`p-6 rounded-lg border ${
        isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
      }`}>
        <p className="text-center">No content available for quiz generation</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {!questions.length ? (
        <div className="space-y-4">
          <button
            onClick={generateQuiz}
            disabled={isLoading}
            className={`w-full px-4 py-2 rounded-lg transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white`}
          >
            {isLoading ? 'Generating Quiz...' : 'Start Quiz'}
          </button>

          {quizHistory.length > 0 && (
            <div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 text-purple-500 hover:text-purple-600"
              >
                <History className="h-4 w-4" />
                <span>View Past Attempts</span>
              </button>

              {showHistory && (
                <div className="mt-4 space-y-4">
                  {quizHistory.map((attempt, index) => (
                    <div
                      key={attempt.id}
                      className={`p-4 rounded-lg ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Attempt {quizHistory.length - index}</span>
                        <span className="text-sm opacity-70">
                          {new Date(attempt.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {/* Performance Overview */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm opacity-70">Score</p>
                          <p className="font-bold">{(attempt.score ?? 0).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-sm opacity-70">Avg. Time</p>
                          <p className="font-bold">
                            {formatTime(attempt.performanceMetrics?.averageTime ?? 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm opacity-70">Consistency</p>
                          <p className="font-bold">
                            {(attempt.performanceMetrics?.consistencyScore ?? 0).toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <button
                        onClick={() => handleViewAttemptDetails(attempt.id)}
                        className={`w-full mt-2 px-4 py-2 rounded-lg transition-colors ${
                          isDarkMode
                            ? 'bg-gray-600 hover:bg-gray-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                        } flex items-center justify-center gap-2`}
                      >
                        {selectedAttemptId === attempt.id ? 'Hide Details' : 'View Details'}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            selectedAttemptId === attempt.id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Detailed Analytics */}
                      {selectedAttemptId === attempt.id && (
                        <div className="mt-4 space-y-4">
                          {/* Time Analysis */}
                          <div className="p-4 rounded-lg bg-opacity-10 bg-blue-600">
                            <h4 className="text-sm font-medium text-blue-400 mb-2">Time Analysis</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm opacity-70">Quickest Answer</p>
                                <p className="font-bold">{formatTime(attempt.performanceMetrics?.quickestAnswer ?? 0)}</p>
                              </div>
                              <div>
                                <p className="text-sm opacity-70">Slowest Answer</p>
                                <p className="font-bold">{formatTime(attempt.performanceMetrics?.slowestAnswer ?? 0)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Question Analysis */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium mb-2">Question Analysis</h4>
                            {attempt.analytics?.map((q, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-lg ${
                                  isDarkMode 
                                    ? q.isCorrect ? 'bg-green-900 bg-opacity-20' : 'bg-red-900 bg-opacity-20'
                                    : q.isCorrect ? 'bg-green-50' : 'bg-red-50'
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="font-medium text-sm">Question {q.questionNumber}</p>
                                    <p className="mt-1 text-sm opacity-80">{q.question}</p>
                                  </div>
                                  {q.isCorrect ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                  )}
                                </div>
                                <div className="mt-2 text-sm">
                                  <p>Your answer: <span className={q.isCorrect ? 'text-green-500' : 'text-red-500'}>{q.selectedAnswer}</span></p>
                                  {!q.isCorrect && <p className="text-green-500">Correct answer: {q.correctAnswer}</p>}
                                  <p className="mt-1 opacity-70">Time spent: {formatTime(q.timeSpent)}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Strength Areas */}
                          {attempt.performanceMetrics?.strengthAreas?.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm font-medium mb-1 text-emerald-400">Strength Areas:</p>
                              <ul className="text-sm space-y-1">
                                {attempt.performanceMetrics.strengthAreas.map((area, idx) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                    <span className="opacity-80">{area}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Improvement Areas */}
                          {attempt.performanceMetrics?.improvementAreas?.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm font-medium mb-1 text-rose-400">Areas to Improve:</p>
                              <ul className="text-sm space-y-1">
                                {attempt.performanceMetrics.improvementAreas.map((area, idx) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <Brain className="h-3 w-3 text-rose-400" />
                                    <span className="opacity-80">{area}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : score !== null ? (
        <div className="space-y-4">
          <div className={`p-6 rounded-lg ${
            isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'
          }`}>
            <h3 className="text-xl font-semibold mb-4">Quiz Results</h3>
            <div className="space-y-6">
              {/* Performance Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-opacity-10 bg-purple-600">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-400" />
                    <p className="text-sm text-purple-400">Final Score</p>
                  </div>
                  <p className="text-2xl font-bold">{score.toFixed(1)}%</p>
                </div>
                <div className="p-4 rounded-lg bg-opacity-10 bg-blue-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-400" />
                    <p className="text-sm text-blue-400">Average Time</p>
                  </div>
                  <p className="text-2xl font-bold">{formatTime(performanceMetrics?.averageTime || 0)}</p>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-opacity-10 bg-green-600">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-400" />
                    <p className="text-sm text-green-400">Quickest Answer</p>
                  </div>
                  <p className="text-xl font-bold">{formatTime(performanceMetrics?.quickestAnswer || 0)}</p>
                </div>
                <div className="p-4 rounded-lg bg-opacity-10 bg-yellow-600">
                  <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-yellow-400" />
                    <p className="text-sm text-yellow-400">Slowest Answer</p>
                  </div>
                  <p className="text-xl font-bold">{formatTime(performanceMetrics?.slowestAnswer || 0)}</p>
                </div>
              </div>

              {/* Consistency Score */}
              <div className="p-4 rounded-lg bg-opacity-10 bg-indigo-600">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-indigo-400" />
                  <p className="text-sm text-indigo-400">Consistency Score</p>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2.5">
                  <div
                    className="bg-indigo-500 h-2.5 rounded-full"
                    style={{ width: `${performanceMetrics?.consistencyScore || 0}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-1">{performanceMetrics?.consistencyScore.toFixed(1)}% consistent</p>
              </div>

              {/* Strength & Improvement Areas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-opacity-10 bg-emerald-600">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <p className="text-sm text-emerald-400">Strength Areas</p>
                  </div>
                  <ul className="text-sm space-y-1">
                    {performanceMetrics?.strengthAreas.map((area, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-opacity-10 bg-rose-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-rose-400" />
                    <p className="text-sm text-rose-400">Areas to Improve</p>
                  </div>
                  <ul className="text-sm space-y-1">
                    {performanceMetrics?.improvementAreas.map((area, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-rose-400"></span>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Question Analysis Button */}
              <div className="mt-6">
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    className="text-purple-500 hover:text-purple-600 font-medium"
                  >
                    {showAnalytics ? 'Hide Question Analysis' : 'Show Question Analysis'}
                  </button>

                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-purple-500 hover:text-purple-600 font-medium flex items-center justify-center gap-2"
                  >
                    <History className="h-4 w-4" />
                    {showHistory ? 'Hide Past Attempts' : 'View Past Attempts'}
                  </button>

                  {showAnalytics && (
                    <div className="mt-4 space-y-4">
                      {analytics.map((q, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg ${
                            isDarkMode 
                              ? q.isCorrect ? 'bg-green-900 bg-opacity-20' : 'bg-red-900 bg-opacity-20'
                              : q.isCorrect ? 'bg-green-50' : 'bg-red-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">Question {q.questionNumber}</p>
                              <p className="mt-1 text-sm opacity-80">{q.question}</p>
                            </div>
                            {q.isCorrect ? (
                              <CheckCircle2 className="h-6 w-6 text-green-500" />
                            ) : (
                              <XCircle className="h-6 w-6 text-red-500" />
                            )}
                          </div>
                          <div className="mt-2 text-sm">
                            <p>Your answer: <span className={q.isCorrect ? 'text-green-500' : 'text-red-500'}>{q.selectedAnswer}</span></p>
                            {!q.isCorrect && <p className="text-green-500">Correct answer: {q.correctAnswer}</p>}
                            <p className="mt-1 opacity-70">Time spent: {formatTime(q.timeSpent)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {showHistory && (
                    <div className="mt-4 space-y-4">
                      {quizHistory.map((attempt, index) => (
                        <div
                          key={attempt.id}
                          className={`p-4 rounded-lg ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Attempt {quizHistory.length - index}</span>
                            <span className="text-sm opacity-70">
                              {new Date(attempt.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {/* Performance Overview */}
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm opacity-70">Score</p>
                              <p className="font-bold">{(attempt.score ?? 0).toFixed(1)}%</p>
                            </div>
                            <div>
                              <p className="text-sm opacity-70">Avg. Time</p>
                              <p className="font-bold">
                                {formatTime(attempt.performanceMetrics?.averageTime ?? 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm opacity-70">Consistency</p>
                              <p className="font-bold">
                                {(attempt.performanceMetrics?.consistencyScore ?? 0).toFixed(1)}%
                              </p>
                            </div>
                          </div>

                          {/* View Details Button */}
                          <button
                            onClick={() => handleViewAttemptDetails(attempt.id)}
                            className={`w-full mt-2 px-4 py-2 rounded-lg transition-colors ${
                              isDarkMode
                                ? 'bg-gray-600 hover:bg-gray-500 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                            } flex items-center justify-center gap-2`}
                          >
                            {selectedAttemptId === attempt.id ? 'Hide Details' : 'View Details'}
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                selectedAttemptId === attempt.id ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {/* Detailed Analytics */}
                          {selectedAttemptId === attempt.id && (
                            <div className="mt-4 space-y-4">
                              {/* Time Analysis */}
                              <div className="p-4 rounded-lg bg-opacity-10 bg-blue-600">
                                <h4 className="text-sm font-medium text-blue-400 mb-2">Time Analysis</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm opacity-70">Quickest Answer</p>
                                    <p className="font-bold">{formatTime(attempt.performanceMetrics?.quickestAnswer ?? 0)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm opacity-70">Slowest Answer</p>
                                    <p className="font-bold">{formatTime(attempt.performanceMetrics?.slowestAnswer ?? 0)}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Question Analysis */}
                              <div className="space-y-3">
                                <h4 className="text-sm font-medium mb-2">Question Analysis</h4>
                                {attempt.analytics?.map((q, idx) => (
                                  <div
                                    key={idx}
                                    className={`p-3 rounded-lg ${
                                      isDarkMode 
                                        ? q.isCorrect ? 'bg-green-900 bg-opacity-20' : 'bg-red-900 bg-opacity-20'
                                        : q.isCorrect ? 'bg-green-50' : 'bg-red-50'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <p className="font-medium text-sm">Question {q.questionNumber}</p>
                                        <p className="mt-1 text-sm opacity-80">{q.question}</p>
                                      </div>
                                      {q.isCorrect ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                      ) : (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                      )}
                                    </div>
                                    <div className="mt-2 text-sm">
                                      <p>Your answer: <span className={q.isCorrect ? 'text-green-500' : 'text-red-500'}>{q.selectedAnswer}</span></p>
                                      {!q.isCorrect && <p className="text-green-500">Correct answer: {q.correctAnswer}</p>}
                                      <p className="mt-1 opacity-70">Time spent: {formatTime(q.timeSpent)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Strength Areas */}
                              {attempt.performanceMetrics?.strengthAreas?.length > 0 && (
                                <div className="mb-3">
                                  <p className="text-sm font-medium mb-1 text-emerald-400">Strength Areas:</p>
                                  <ul className="text-sm space-y-1">
                                    {attempt.performanceMetrics.strengthAreas.map((area, idx) => (
                                      <li key={idx} className="flex items-center gap-2">
                                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                        <span className="opacity-80">{area}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Improvement Areas */}
                              {attempt.performanceMetrics?.improvementAreas?.length > 0 && (
                                <div className="mb-3">
                                  <p className="text-sm font-medium mb-1 text-rose-400">Areas to Improve:</p>
                                  <ul className="text-sm space-y-1">
                                    {attempt.performanceMetrics.improvementAreas.map((area, idx) => (
                                      <li key={idx} className="flex items-center gap-2">
                                        <Brain className="h-3 w-3 text-rose-400" />
                                        <span className="opacity-80">{area}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={resetQuiz}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className={`p-6 rounded-lg ${
            isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'
          }`}>
            <div className="flex justify-between mb-4">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>Progress: {Math.round((currentQuestion / questions.length) * 100)}%</span>
            </div>
            
            <h3 className="text-lg font-medium mb-4">
              {questions[currentQuestion].question}
            </h3>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-3 text-left rounded-lg transition-colors ${
                    selectedAnswers[currentQuestion] === index
                      ? isDarkMode
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-100 text-purple-900'
                      : isDarkMode
                      ? 'bg-gray-600 hover:bg-gray-500 text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-4 py-2 rounded-lg ${
                currentQuestion === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className={`px-4 py-2 rounded-lg ${
                selectedAnswers[currentQuestion] === undefined
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white`}
            >
              {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 