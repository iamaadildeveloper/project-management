'use client';

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function Navbar() {
  const { currentUser, loading, logout } = useAuth(); // Changed 'user' to 'currentUser' for consistency
  const router = useRouter(); // Initialize useRouter

  // Determine the display name for the user
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
    <nav className="bg-white shadow-sm py-4 px-6 font-inter"> {/* Added font-inter for consistency */}
      <div className="flex justify-between items-center max-w-7xl mx-auto"> {/* Added max-w-7xl mx-auto for centering */}
        <div>
          <Link href="/" className="text-xl font-semibold text-gray-800"> {/* Added text-gray-800 */}
            Project Management
          </Link>
          <p className="text-gray-600 text-sm">Where you can manage your projects</p> {/* Added text-gray-600 text-sm */}
        </div>
        <div>
          {currentUser ? ( // Changed 'user' to 'currentUser'
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">Hello, {userName}</span> {/* Added text-gray-700 font-medium */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md" // Enhanced styling
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link href="/login">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md"> {/* Enhanced styling */}
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200"> {/* Enhanced styling */}
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
