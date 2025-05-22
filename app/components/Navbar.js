'use client';

import { useState } from 'react'; // Import useState
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'; // Import toggle icons (Bars3Icon and XMarkIcon removed as they are no longer needed)

// Accept sidebarOpen and setSidebarOpen as props from RootLayout (though Navbar will manage its own mobile menu)
export default function Navbar({ sidebarOpen, setSidebarOpen }) { // Keep these props as they might be used by RootLayout for the main sidebar toggle
  const { currentUser, loading, logout } = useAuth();
  const router = useRouter();
  // const [isNavMenuOpen, setIsNavMenuOpen] = useState(false); // State for Navbar's mobile menu - no longer needed

  const userName = currentUser?.displayName || currentUser?.email || 'User';

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login'); // Redirect to login page after successful logout
    } catch (error) {
      console.error('Failed to log out:', error);
      // Optionally, display an error message to the user
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <nav className="bg-white shadow-sm py-4 px-6 font-inter relative z-30"> {/* Added relative z-30 for stacking context */}
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Mobile Navbar Toggle Button (for Navbar's own menu) - REMOVED */}
        {/* <button
          className="md:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isNavMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button> */}

        {/* Logo/Brand */}
        {/* Adjusted margin-left to prevent overlap with Navbar toggle button on mobile - adjusted back as toggle is removed */}
        <Link href="/" className="text-xl font-semibold text-gray-800">
          Project Management
        </Link>
        {/* Tagline hidden on mobile */}
        <p className="text-gray-600 text-sm hidden md:block">Where you can manage your projects</p>

        {/* Desktop Navigation Links - REMOVED */}
        {/* <div className="hidden md:flex space-x-6">
          {currentUser && (
            <>
              <Link href="/dashboard" className="text-gray-700 text-lg hover:text-indigo-600 transition-colors duration-200">
                Dashboard
              </Link>
              <Link href="/projects" className="text-gray-700 text-lg hover:text-indigo-600 transition-colors duration-200">
                Projects
              </Link>
              <Link href="/employees" className="text-gray-700 text-lg hover:text-indigo-600 transition-colors duration-200">
                Employees
              </Link>
            </>
          )}
        </div> */}

        {/* User Info and Auth Buttons */}
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium hidden md:block">Hello, {userName}</span> {/* Hide on small mobile for space */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link href="/login">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200">
                  Signup
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu - slides down from Navbar - REMOVED */}
      {/* <div className={`
        md:hidden absolute top-full left-0 w-full bg-white shadow-md
        transition-all duration-300 ease-in-out overflow-hidden
        ${isNavMenuOpen ? 'max-h-screen opacity-100 py-4' : 'max-h-0 opacity-0 py-0'}
      `}>
        {currentUser && (
          <div className="flex flex-col space-y-2 px-6">
            <Link href="/dashboard" className="text-gray-700 text-lg hover:text-indigo-600 transition-colors duration-200 py-2" onClick={() => setIsNavMenuOpen(false)}>
              Dashboard
            </Link>
            <Link href="/projects" className="text-gray-700 text-lg hover:text-indigo-600 transition-colors duration-200 py-2" onClick={() => setIsNavMenuOpen(false)}>
              Projects
            </Link>
            <Link href="/employees" className="text-gray-700 text-lg hover:text-indigo-600 transition-colors duration-200 py-2" onClick={() => setIsNavMenuOpen(false)}>
              Employees
            </Link>
          </div>
        )}
      </div> */}
    </nav>
  );
}
