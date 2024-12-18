'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col bg-gray-50">
      <header className="bg-white border-gray-200 px-4 py-3 border-b">
        <Link href="/physics/notes" className="inline-flex items-center gap-2 text-gray-700 text-sm">
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pt-2">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Two-dimensional Motion
        </h1>
        
        <p className="text-gray-700 mb-6">
          A ball is thrown with an initial velocity of 30 feet per second horizontally 
          and 40 feet per second vertically. What is the magnitude of the initial velocity vector?
        </p>

        <div className="space-y-3">
          {options.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 rounded-xl bg-white border border-gray-200 text-left text-sm text-gray-700 hover:border-emerald-500 transition-colors"
            >
              {option.text}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 p-4 border-t border-gray-200 bg-white">
        <Link 
          href="/physics/notes" 
          className="flex-1 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white py-3 rounded-xl text-sm font-medium transition-colors text-center"
        >
          View Notes
        </Link>
        <button className="flex-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 py-3 rounded-xl text-sm font-medium transition-colors">
          Hint
        </button>
      </div>
    </div>
  );
};

export default TwoDimensionalMotion;