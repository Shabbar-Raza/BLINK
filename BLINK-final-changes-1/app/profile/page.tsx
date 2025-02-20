'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const router = useRouter();

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
        <h1 className="text-xl font-semibold">Profile</h1>
      </div>

      {/* Profile Content */}
      <div className="p-4 space-y-6">
        <div className="flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-4"
          >
            <UserCircle className="w-16 h-16 text-emerald-600" />
          </motion.div>
          <h2 className="text-xl font-semibold">User Name</h2>
          <p className="text-gray-500">user@example.com</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border">
            <h3 className="font-medium mb-2">Personal Information</h3>
            <div className="space-y-2">
              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <input
                  type="text"
                  className="w-full p-2 rounded-xl border mt-1"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <input
                  type="email"
                  className="w-full p-2 rounded-xl border mt-1"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-emerald-500 text-white py-3 rounded-xl font-medium"
          >
            Save Changes
          </motion.button>
        </div>
      </div>
    </div>
  );
} 