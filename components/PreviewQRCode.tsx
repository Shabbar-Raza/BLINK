'use client';

import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const PreviewQRCode = () => {
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    // Get your local IP address instead of localhost
    // Example: 'http://192.168.1.XXX:3000/preview'
    const baseUrl = 'http://YOUR_LOCAL_IP:3000';
    setPreviewUrl(`${baseUrl}/preview`);
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-xl shadow-lg">
      <div className="text-center mb-2">
        <h3 className="font-bold text-lg">Scan to preview</h3>
        <p className="text-sm text-gray-500">Open on your phone</p>
      </div>
      <QRCodeSVG
        value={previewUrl}
        size={256} // Increased size for better scanning
        level="H"
        includeMargin={true}
        className="mx-auto"
      />
    </div>
  );
};

export default PreviewQRCode; 