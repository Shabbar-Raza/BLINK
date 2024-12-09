'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Register = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [mobile, setMobile] = React.useState('');

  const isFormValid = username.trim() !== '' && 
                     password.trim() !== '' && 
                     mobile.trim() !== '';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
        {/* Register Illustration */}
        <div className="flex justify-center mb-2">
          <Image 
            src="/media/logo.png" 
            alt="Register" 
            width={350} 
            height={350} 
            priority 
          />
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h1 className="text-2xl font-semibold mb-2">Register</h1>
          <p className="text-gray-500 text-sm mb-8">Please register to login.</p>
          
          <form className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <div className="flex items-center">
                  <span className="absolute left-4">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center">
                  <span className="absolute left-4">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
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

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <label className="flex items-center text-sm text-gray-500">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mr-2 rounded border-gray-300"
                  />
                  Remember me next time
                </label>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-medium mt-6 ${
                isFormValid 
                  ? 'bg-[#1e2a4a] text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!isFormValid}
              onClick={(e) => {
                e.preventDefault();
                if (isFormValid) {
                  window.location.href = '/register/education';
                }
              }}
            >
              Next
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-[#1e2a4a] font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;