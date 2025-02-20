'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, HelpCircle } from 'lucide-react';

const TwoDimensionalMotion = () => {
  const [options] = useState([
    {
      id: 1,
      text: "50 feet per second",
      isCorrect: true,
      explanation: "Using the Pythagorean theorem, √(30² + 40²) = 50 feet per second"
    },
    {
      id: 2,
      text: "70 feet per second",
      isCorrect: false,
      explanation: "This is incorrect. The magnitude is calculated using √(30² + 40²)"
    },
    {
      id: 3,
      text: "35 feet per second",
      isCorrect: false,
      explanation: "This is incorrect. The magnitude is calculated using √(30² + 40²)"
    }
  ]);

  const [showHint, setShowHint] = useState(false);

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col bg-gray-50">
      <header className="bg-white border-gray-200 px-4 py-3 border-b">
        <Link 
          href="/physics/two-dimensional-motion/notes" 
          className="inline-flex items-center gap-2 text-gray-700 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Notes</span>
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pt-2">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-900">
            Two-dimensional Motion
          </h1>
          <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-sm">
            Quiz
          </span>
        </div>
        
        <p className="text-gray-700 mb-6">
          A ball is thrown with an initial velocity of 30 feet per second horizontally 
          and 40 feet per second vertically. What is the magnitude of the initial velocity vector?
        </p>

        <div className="space-y-3 mb-4">
          {options.map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 rounded-xl bg-white border border-gray-200 text-left text-sm text-gray-700 hover:border-emerald-500 transition-colors"
            >
              {option.text}
            </motion.button>
          ))}
        </div>

        {showHint && (
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-blue-700">
              Think about the Pythagorean theorem! When you have two perpendicular components 
              of a vector, you can find its magnitude using a² + b² = c².
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex gap-4 p-4 border-t border-gray-200 bg-white">
        <Link 
          href="/physics/two-dimensional-motion/notes"
          className="flex-1 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <BookOpen className="h-4 w-4" />
          Learn
        </Link>
        <button 
          onClick={() => setShowHint(!showHint)}
          className="flex-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <HelpCircle className="h-4 w-4" />
          Hint
        </button>
      </div>
    </div>
  );
};

export default TwoDimensionalMotion;