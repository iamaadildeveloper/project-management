'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { googleLogin, loginWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await loginWithEmail(email, password);
      // redirect or show success
    } catch (err) {
      setError(err.message || 'Failed to login');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded shadow bg-white">
      <h1 className="text-2xl mb-6 font-semibold">Login</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="border px-3 py-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      <hr className="my-6" />

      <button
        onClick={googleLogin}
        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
      >
        Continue with Google
      </button>

      <p className="mt-4 text-center">
        <p>{`Don't have an account?`}</p>
        <a href="/signup" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}