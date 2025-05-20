'use client';

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <nav className="bg-white shadow-sm py-4 px-6">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold">
          Freelance Management
        </Link>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span>Hello, {user.displayName || user.email}</span>
              <button 
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link href="/login">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Signup
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}