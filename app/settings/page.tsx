'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Moon, Sun, Bell, Lock, Palette } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../contexts/ThemeContext';

export default function Settings() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const settingsOptions = [
    {
      icon: isDarkMode ? Sun : Moon,
      title: 'Dark Mode',
      description: 'Toggle dark/light theme',
      action: toggleDarkMode,
      isToggle: true
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Manage notification settings',
      link: '/settings/notifications'
    },
    {
      icon: Lock,
      title: 'Privacy',
      description: 'Manage your privacy settings',
      link: '/settings/privacy'
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Customize your interface',
      link: '/settings/appearance'
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
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      {/* Settings Content */}
      <div className="p-4 space-y-4">
        {settingsOptions.map((option, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-2xl p-4 shadow-sm border cursor-pointer"
            onClick={() => option.action ? option.action() : router.push(option.link || '#')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <option.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-medium">{option.title}</h3>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
              </div>
              {option.isToggle && (
                <div className={`w-11 h-6 rounded-full transition-colors ${
                  isDarkMode ? 'bg-emerald-500' : 'bg-gray-200'
                } relative`}>
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    isDarkMode ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 