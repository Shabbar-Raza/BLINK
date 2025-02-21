'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Lock, Palette } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const settingsOptions = [
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Toggle notification settings',
      action: () => setNotificationsEnabled(!notificationsEnabled),
      isToggle: true,
      toggleState: notificationsEnabled
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
      {/* Header - Reduced padding */}
      <div className="sticky top-0 bg-white border-b px-3 py-3 flex items-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="mr-3"
        >
          <ArrowLeft className="h-5 w-5" />
        </motion.button>
        <h1 className="text-lg font-semibold">Settings</h1>
      </div>

      {/* Settings Content - Adjusted padding */}
      <div className="px-3 py-3 space-y-3">
        {settingsOptions.map((option, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-xl p-3 shadow-sm border cursor-pointer"
            onClick={() => option.action ? option.action() : router.push(option.link || '#')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <option.icon className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{option.title}</h3>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
              </div>
              {option.isToggle && (
                <div className={`w-10 h-5 rounded-full transition-colors ${
                  option.toggleState ? 'bg-emerald-500' : 'bg-gray-200'
                } relative`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                    option.toggleState ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Notification Info Text - Adjusted padding */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            Notifications will be turned off by using the app. You can manage your notification preferences here.
          </p>
        </div>
      </div>
    </div>
  );
} 