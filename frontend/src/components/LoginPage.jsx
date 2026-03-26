import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from './ui/button';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to real backend later
    alert("✅ Login successful!");
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-10">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome Back</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 bg-zinc-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-4 bg-zinc-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <Button type="submit" className="w-full py-7 text-lg bg-purple-600 hover:bg-purple-700">
            Log In
          </Button>
        </form>
        <p className="text-center text-gray-400 mt-8">
          New here? <Link to="/signup" className="text-purple-400 hover:underline">Create free account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;