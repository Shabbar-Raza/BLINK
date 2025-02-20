'use client';

import BlinkHomePreview from '@/components/BLINKHomepage';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative">
      <div className="absolute top-4 right-4">
        <Link 
          href="/rag-chat"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          RAG
        </Link>
      </div>
      <BlinkHomePreview />
    </main>
  );
}