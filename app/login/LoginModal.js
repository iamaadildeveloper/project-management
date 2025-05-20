// components/LoginModal.js
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function LoginModal({ 
  isOpen,
  onClose
}) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Sign In Required</h2>
        <p className="mb-6">You need to sign in to create projects.</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
          >
            Cancel
          </button>
          <Link
            href="/login"
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}