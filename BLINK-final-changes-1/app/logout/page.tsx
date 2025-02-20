'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Add your logout logic here
    // For example: clear local storage, cookies, etc.
    localStorage.clear();
    
    // Redirect to login page
    router.push('/login');
  }, [router]);

  return null;
} 