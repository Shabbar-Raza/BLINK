'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Help() {
  const router = useRouter();

  const helpTopics = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of using BLINK',
      link: '/help/getting-started'
    },
    {
      title: 'Courses',
      description: 'How to manage your courses',
      link: '/help/courses'
    },
    {
      title: 'Problems',
      description: 'Get help with solving problems',
      link: '/help/problems'
    },
    {
      title: 'FAQ',
      description: 'Frequently asked questions',
      link: '/help/faq'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b p-4 flex items-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="mr-4"
        >
          <ArrowLeft className="h-6 w-6" />
        </motion.button>
        <h1 className="text-xl font-semibold">Help Center</h1>
      </div>

      {/* Search */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search help articles..."
          className="w-full p-3 rounded-xl border bg-gray-50"
        />
      </div>

      {/* Help Topics */}
      <div className="p-4 space-y-4">
        {helpTopics.map((topic, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-2xl p-4 shadow-sm border cursor-pointer"
            onClick={() => router.push(topic.link)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{topic.title}</h3>
                <p className="text-sm text-gray-500">{topic.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contact Support */}
      <div className="p-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-emerald-500 text-white py-3 rounded-xl font-medium"
        >
          Contact Support
        </motion.button>
      </div>
    </div>
  );
} 