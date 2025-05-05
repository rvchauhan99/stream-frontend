'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../store/api/authApi';
import { setCredentials } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [login] = useLoginMutation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(form).unwrap();
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      dispatch(setCredentials({ user: res.user, token: res.token }));

      toast.success('Login successful');
      router.push('/subscriptions'); // or dashboard
    } catch (error: any) {
      toast.error(error?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1216] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1a1f25] p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl text-white font-bold mb-6">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-400 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-[#2a2f35] text-white outline-none"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-400 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-[#2a2f35] text-white outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-md bg-purple-500 hover:bg-purple-600 text-white font-semibold transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
