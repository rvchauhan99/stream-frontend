'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, } from 'lucide-react';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement signup logic
    console.log({ name, email, password, acceptTerms });
  };

  return (
    <div className="min-h-screen bg-dark-6 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Create Account</h1>
          <p className="text-grey-70">Join our community of video enthusiasts</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="bg-dark-10 rounded-2xl p-8 shadow-xl">
          {/* Name Input */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-grey-70 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-dark-15 border border-dark-25 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-red-45 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>

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

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-grey-70 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dark-15 border border-dark-25 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-red-45 focus:border-transparent"
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-70 hover:text-primary"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="mt-2 text-sm text-grey-70">
              Must be at least 8 characters long
            </p>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-6">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 mt-1 rounded border-dark-25 bg-dark-15 text-red-45 focus:ring-red-45"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-grey-70">
                I agree to the{' '}
                <Link href="/terms" className="text-red-45 hover:text-red-55">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-red-45 hover:text-red-55">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-45 text-primary py-3 rounded-lg font-medium hover:bg-red-55 transition-colors"
          >
            Create Account
          </button>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-grey-70">
            Already have an account?{' '}
            <Link href="/login" className="text-red-45 hover:text-red-55">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
} 