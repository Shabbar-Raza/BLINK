'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, FileText, Loader, Download, Copy, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const NotesPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setTimeout(() => {
        setGeneratedNotes(`
# Chapter 1: Introduction to Physics

## Key Concepts
- Motion and Forces
- Energy and Work
- Momentum and Collisions

## Summary
This chapter introduces fundamental concepts in physics, including:
- Newton's Laws of Motion
- Conservation of Energy
- Basic Kinematics`);
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
              <h1 className="text-xl font-semibold text-gray-800">Smart Notes</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Upload Material</h2>
              <label className="cursor-pointer block">
                <div className="border-2 border-dashed border-emerald-200 rounded-xl p-8 hover:border-emerald-400 transition-colors bg-emerald-50/50">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Drop your file here or click to upload
                    </span>
                    <span className="text-xs text-gray-500">
                      Supports PDF, DOC, TXT (Max 10MB)
                    </span>
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            {isLoading && (
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Loader className="w-8 h-8 animate-spin text-emerald-600" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-800">Processing your document</p>
                    <p className="text-sm text-gray-500">This might take a minute...</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Generated Notes Section */}
          {generatedNotes && !isLoading && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800">Generated Notes</h2>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Copy className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Share2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              <div className="p-6 prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-700">{generatedNotes}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage; 