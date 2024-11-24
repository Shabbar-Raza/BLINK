'use client';

import React, { useEffect, useState } from 'react';
import ChatInterface from '@/components/ChatInterface';

export default function PreviewPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/mobile/i.test(window.navigator.userAgent));
  }, []);

  if (!isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Please open on a mobile device</h1>
          <p className="text-gray-600">This preview is optimized for mobile viewing</p>
        </div>
      </div>
    );
  }

  return <ChatInterface />;
} 