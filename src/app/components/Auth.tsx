import { useState } from 'react';
import {
  LockClosedIcon,
  EnvelopeIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface FormData {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  name?: string;
  confirmPassword?: string;
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const passwordRequirements = [
    { label: 'At least 8 characters', test: (pass: string) => pass.length >= 8 },
    { label: 'Contains uppercase letter', test: (pass: string) => /[A-Z]/.test(pass) },
    { label: 'Contains lowercase letter', test: (pass: string) => /[a-z]/.test(pass) },
    { label: 'Contains number', test: (pass: string) => /[0-9]/.test(pass) },
    { label: 'Contains special character', test: (pass: string) => /[!@#$%^&*]/.test(pass) },
  ];

  const validateForm = () => {
    const newErrors: ValidationErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Name validation (for signup)
    if (!isLogin && !formData.name) {
      newErrors.name = 'Name is required';
    }

    // Confirm password validation (for signup)
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // TODO: Implement actual authentication logic here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated API call
      router.push('/dashboard');
      console.log('Form submitted:', formData);
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <div className="min-h-screen bg-dark-8 flex items-center justify-center p-4">
      <div className="bg-dark-10 rounded-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p className="text-grey-70">
            {isLogin
              ? 'Sign in to access your account'
              : 'Join us and start creating content'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 text-grey-70" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className={`w-full bg-dark-15 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 ${
                    errors.name ? 'focus:ring-red-500' : 'focus:ring-red-45'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
          )}

          <div>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-2.5 text-grey-70" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className={`w-full bg-dark-15 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 ${
                  errors.email ? 'focus:ring-red-500' : 'focus:ring-red-45'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-2.5 text-grey-70" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className={`w-full bg-dark-15 text-white pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:ring-1 ${
                  errors.password ? 'focus:ring-red-500' : 'focus:ring-red-45'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-grey-70 hover:text-white"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {!isLogin && (
            <>
              <div>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-2.5 text-grey-70" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm Password"
                    className={`w-full bg-dark-15 text-white pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:ring-1 ${
                      errors.confirmPassword ? 'focus:ring-red-500' : 'focus:ring-red-45'
                    }`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-grey-70 text-sm">Password Requirements:</p>
                <div className="grid grid-cols-1 gap-2">
                  {passwordRequirements.map((req, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 text-sm ${
                        req.test(formData.password || '')
                          ? 'text-green-500'
                          : 'text-grey-70'
                      }`}
                    >
                      {req.test(formData.password || '') ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircleIcon className="h-4 w-4 text-grey-70" />
                      )}
                      <span>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-red-45 text-white py-2 rounded-lg hover:bg-red-60 transition-colors ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>

          <p className="text-center text-grey-70 mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setFormData({
                  email: '',
                  password: '',
                  name: '',
                  confirmPassword: '',
                });
              }}
              className="text-red-45 hover:text-red-60 ml-2"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
} 