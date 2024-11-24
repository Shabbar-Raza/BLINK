'use client';

import dynamic from 'next/dynamic';

const TwoDimensionalMotion = dynamic(() => import('@/components/TwoDimensionalMotion'), {
  ssr: false
});

export default function TwoDimensionalMotionPage() {
  return <TwoDimensionalMotion />;
} 