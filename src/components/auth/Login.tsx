/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLoginMutation } from '@/featrues/user/userApi';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import img from '../../assets/Screenshot_21.png'; // Use your illustration image path

const Login: React.FC = () => {
  const [login, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(formData).unwrap();
      localStorage.setItem('token', result.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      // handle validation errors if any here
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side Illustration */}
      <div className="w-1/2 bg-[#0f172a] flex items-center justify-center">
        <img
          src={img}
          alt="Login Illustration"
          className="w-[70%] object-contain"
        />
      </div>

      {/* Right Side Login Form */}
      <div className="w-1/2 bg-white flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-[80%] max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-center">Login</h2>
          <p className="text-center text-gray-500 mb-6">Please enter your credentials to log in.</p>

          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:[#60e5ae]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#60e5ae] text-black font-semibold rounded-lg transition duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          {error && (
            <p className="text-red-500 text-center">
              {(error as any)?.data?.message || 'Login failed'}
            </p>
          )}

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <span
              className="font-semibold text-black cursor-pointer hover:underline"
              onClick={() => navigate('/register')}
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
