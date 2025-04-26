'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password reset logic
    setIsSubmitted(true);
    console.log({ email });
  };

  return (
    <div className="min-h-screen bg-dark-6 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Reset Password</h1>
          <p className="text-grey-70">
            Enter your email address and we&apos;ll send you instructions to reset your password
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="bg-dark-10 rounded-2xl p-8 shadow-xl">
            {/* Email Input */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-grey-70 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-dark-15 border border-dark-25 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-red-45 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-45 text-primary py-3 rounded-lg font-medium hover:bg-red-55 transition-colors"
            >
              Send Reset Instructions
            </button>

            {/* Back to Login */}
            <p className="mt-6 text-center text-grey-70">
              Remember your password?{' '}
              <Link href="/login" className="text-red-45 hover:text-red-55">
                Back to login
              </Link>
            </p>
          </form>
        ) : (
          <div className="bg-dark-10 rounded-2xl p-8 shadow-xl text-center">
            <div className="mb-4 text-green-500">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">Check Your Email</h2>
            <p className="text-grey-70 mb-6">
              We&apos;ve sent password reset instructions to your email address.
            </p>
            <Link
              href="/login"
              className="text-red-45 hover:text-red-55 font-medium"
            >
              Back to login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 