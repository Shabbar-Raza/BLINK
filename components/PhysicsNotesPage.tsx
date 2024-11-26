'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Play, CheckCircle, BookOpen, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const PhysicsNotesPage: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPDF = async () => {
    try {
      setIsDownloading(true);
      
      // Import jsPDF dynamically
      const { default: JsPDF } = await import('jspdf');
      const doc = new JsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('Two-dimensional Motion Notes', 20, 20);
      
      // Add content sections
      doc.setFontSize(12);
      doc.text('Introduction:', 20, 40);
      doc.setFontSize(10);
      doc.text('Examine the principles of two-dimensional motion, including vector analysis,', 20, 50);
      doc.text('projectile motion, and the effects of forces in multiple dimensions in High School Physics.', 20, 60);
      
      // Add Key Concepts
      doc.setFontSize(12);
      doc.text('Key Concepts:', 20, 80);
      doc.setFontSize(10);
      doc.text('• Motion can be analyzed independently in x and y directions', 25, 90);
      doc.text('• Horizontal velocity remains constant (neglecting air resistance)', 25, 100);
      doc.text('• Vertical motion is affected by gravity (g = 9.81 m/s²)', 25, 110);
      
      // Add Equations
      doc.setFontSize(12);
      doc.text('Important Equations:', 20, 130);
      doc.setFontSize(10);
      doc.text('Horizontal Motion:', 25, 140);
      doc.text('x = x₀ + v₀ₓt', 30, 150);
      doc.text('vₓ = v₀ₓ', 30, 160);
      
      doc.text('Vertical Motion:', 25, 180);
      doc.text('y = y₀ + v₀ᵧt - ½gt²', 30, 190);
      doc.text('vᵧ = v₀ᵧ - gt', 30, 200);

      // Save the PDF
      doc.save('two-dimensional-motion-notes.pdf');
      
      console.log('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-gray-200 px-4 py-3 border-b">
        <div className="flex justify-between items-center">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-700 text-sm">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={downloadPDF}
              disabled={isDownloading}
              className={`p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors ${
                isDownloading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Download className={`h-4 w-4 ${isDownloading ? 'animate-pulse' : ''}`} />
            </motion.button>
            <Share2 className="h-4 w-4 text-gray-700" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-lg mx-auto pt-4 px-4 pb-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600">📚</span>
          </div>
          <h1 className="text-2xl font-bold">Two-dimensional motion</h1>
        </div>

        <p className="text-gray-700 mb-8">
          Examine the principles of two-dimensional motion, including vector analysis, projectile
          motion, and the effects of forces in multiple dimensions in High School Physics.
        </p>

        {/* Unit Section */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-semibold">Unit 1, Skill 1</h2>
              <p className="text-gray-500">Two-dimensional projectile motion</p>
            </div>
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">
              Practice
            </span>
          </div>
          <Link href="/physics/two-dimensional-motion/notes">
            <button className="w-full bg-orange-500 text-white py-3 rounded-lg flex items-center justify-center gap-2">
              <BookOpen className="h-5 w-5" />
              View Notes
            </button>
          </Link>
        </div>

        {/* Course Proficiency */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Course Proficiency</h2>
          <div className="bg-orange-50 rounded-full h-4 mb-2">
            <div className="bg-orange-500 h-full rounded-full" style={{ width: '0%' }}></div>
          </div>
          <p className="text-right text-sm text-gray-600">0%</p>
        </div>

        {/* Course Content */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Two-dimensional motion</h3>
            <CheckCircle className="h-5 w-5 text-gray-300" />
          </div>

          <div className="space-y-4">
            <Link href="/physics/two-dimensional-motion/quiz" className="w-full">
              <button className="w-full flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                <Play className="h-5 w-5 text-orange-500" />
                <span>Two-dimensional projectile motion</span>
                <CheckCircle className="h-5 w-5 text-gray-300 ml-auto" />
              </button>
            </Link>

            <Link href="/physics/optimal-angle/quiz" className="w-full">
              <button className="w-full flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                <Play className="h-5 w-5 text-orange-500" />
                <span>Optimal angle for a projectile</span>
                <CheckCircle className="h-5 w-5 text-gray-300 ml-auto" />
              </button>
            </Link>

            <Link href="/physics/unit-quiz" className="w-full">
              <button className="w-full flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                <Play className="h-5 w-5 text-purple-500" />
                <span>Unit Quiz</span>
                <CheckCircle className="h-5 w-5 text-gray-300 ml-auto" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicsNotesPage;