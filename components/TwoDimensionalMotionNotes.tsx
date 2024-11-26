'use client';

import React from 'react';
import { ArrowLeft, Download, Bookmark, Share2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const TwoDimensionalMotionNotes = () => {
  const courseContent = [
    {
      title: "Two-dimensional projectile motion",
      icon: "🎯",
      link: "/physics/two-dimensional-motion/quiz"
    },
    {
      title: "Optimal angle for a projectile",
      icon: "📐",
      link: "/physics/optimal-angle/quiz"
    },
    {
      title: "Unit Quiz",
      icon: "📝",
      link: "/physics/unit-quiz"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/physics/two-dimensional-motion" className="inline-flex items-center gap-2 text-gray-700 text-sm">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Practice</span>
          </Link>
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <Download className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <Bookmark className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <Share2 className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Two-dimensional Motion</h1>
          
          {/* Introduction */}
          <section className="mb-8">
            <p className="text-gray-700 leading-relaxed mb-4 break-words">
              Two-dimensional motion describes the movement of objects in a plane, combining horizontal and vertical components. Understanding this concept is crucial for analyzing projectile motion, sports physics, and real-world applications.
            </p>
          </section>

          {/* Key Concepts */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Concepts</h2>
            <div className="bg-emerald-50 rounded-xl p-4 space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 break-words">Motion can be analyzed independently in x and y directions</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 break-words">Horizontal velocity remains constant (neglecting air resistance)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 break-words">Vertical motion is affected by gravity (g = 9.81 m/s²)</p>
              </div>
            </div>
          </section>

          {/* Vector Components Diagram */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Vector Components</h2>
            <div className="bg-gray-100 p-4 rounded-xl mb-4 overflow-x-auto">
              <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap">
                v₀ = √(v₀ₓ² + v₀ᵧ²)
                θ = tan⁻¹(v₀ᵧ/v₀ₓ)
              </pre>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="aspect-video bg-gray-50 rounded-lg flex items-center justify-center mb-3 overflow-x-auto">
                <pre className="text-xs text-gray-600 font-mono whitespace-pre">
                  {`
    v₀ᵧ ↑    ↗ v₀
         •
         |\\
         | \\
    -----+--\\----→
         |   \\    v₀ₓ
         |    \\
         |     \\
         |      \\
                  `}
                </pre>
              </div>
              <p className="text-sm text-gray-600 break-words">Vector diagram showing initial velocity components</p>
            </div>
          </section>

          {/* Equations */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Important Equations</h2>
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-xl p-4 overflow-x-auto">
                <h3 className="font-medium text-purple-900 mb-2">Horizontal Motion</h3>
                <pre className="text-sm text-purple-700 font-mono whitespace-pre-wrap">
                  x = x₀ + v₀ₓt
                  vₓ = v₀ₓ
                </pre>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 overflow-x-auto">
                <h3 className="font-medium text-orange-900 mb-2">Vertical Motion</h3>
                <pre className="text-sm text-orange-700 font-mono whitespace-pre-wrap">
                  y = y₀ + v₀ᵧt - ½gt²
                  vᵧ = v₀ᵧ - gt
                </pre>
              </div>
            </div>
          </section>

          {/* Example Problem */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Example Problem</h2>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-gray-700 mb-4 break-words">
                A ball is thrown with an initial velocity of 30 ft/s horizontally and 40 ft/s vertically.
              </p>
              <div className="space-y-2">
                <p className="text-gray-700 break-words"><strong>Step 1:</strong> Use Pythagorean theorem</p>
                <div className="overflow-x-auto">
                  <pre className="text-sm text-blue-700 font-mono bg-blue-100 p-2 rounded whitespace-pre-wrap">
                    v₀ = √(30² + 40²) = √(900 + 1600) = √2500 = 50 ft/s
                  </pre>
                </div>
                <p className="text-gray-700 break-words"><strong>Step 2:</strong> Find angle</p>
                <div className="overflow-x-auto">
                  <pre className="text-sm text-blue-700 font-mono bg-blue-100 p-2 rounded whitespace-pre-wrap">
                    θ = tan⁻¹(40/30) = 53.13°
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Practice Tips */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Practice Tips</h2>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <p className="text-gray-700 break-words">✓ Break vectors into components first</p>
              <p className="text-gray-700 break-words">✓ Analyze horizontal and vertical motion separately</p>
              <p className="text-gray-700 break-words">✓ Draw vector diagrams for visualization</p>
              <p className="text-gray-700 break-words">✓ Check units for consistency</p>
            </div>
          </section>

          {/* Add Course Content section after Practice Tips */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Content</h2>
            <div className="space-y-3">
              {courseContent.map((content, index) => (
                <Link key={index} href={content.link}>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 text-left hover:border-orange-500 transition-colors group"
                  >
                    <span className="text-2xl">{content.icon}</span>
                    <span className="text-gray-700 group-hover:text-gray-900">
                      {content.title}
                    </span>
                    <div className="ml-auto flex items-center gap-2 text-gray-400 group-hover:text-orange-500">
                      <span className="text-sm">Start</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </motion.button>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TwoDimensionalMotionNotes; 