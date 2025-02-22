'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;

    try {
      setLoading(true);
      setError('');

      console.log('Login attempt with:', { email, password }); // Debug log

      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log('Login response:', data); // Debug log

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      router.push('/'); // Redirect to home page after successful login
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Login Illustration */}
        <div className="flex justify-center mb-4">
          <Image 
            src="/media/logo.png" 
            alt="Login" 
            width={300} 
            height={300} 
            priority 
          />
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h1 className="text-2xl font-semibold mb-2">Login</h1>
          <p className="text-gray-500 text-sm mb-8">Please Sign in to continue.</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <div className="flex items-center">
                  <span className="absolute left-4">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center">
                  <span className="absolute left-4">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-medium mt-6 ${
                isFormValid && !loading
                  ? 'bg-[#1e2a4a] text-white hover:bg-[#283a6d] transition-colors' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!isFormValid || loading}
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#1e2a4a] font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;