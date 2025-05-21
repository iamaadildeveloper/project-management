'use client';

import { useState, useEffect } from 'react'; // Import useEffect
import { useAuth } from '../context/AuthContext'; // Adjust the path if needed
import { useRouter } from 'next/navigation';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
export default function LoginPage() {
    const { googleLogin, loginWithEmail, currentUser } = useAuth(); // Destructure currentUser from useAuth
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { push } = useRouter();

    // Effect to redirect if user is already logged in or becomes logged in
    useEffect(() => {
        if (currentUser) {
            push('/dashboard');
        }
    }, [currentUser, push]); // Rerun when currentUser or push changes

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await loginWithEmail(email, password);
            // Redirection is now handled by the useEffect for all login methods
            // push('/dashboard'); // This line can be removed as useEffect handles it
        } catch (err) {
            setError(err.message || 'Failed to login.');
            console.error('Login Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Google login separately (it will also trigger the useEffect)
    const handleGoogleLogin = async () => {
        setError('');
        setIsLoading(true);
        try {
            await googleLogin();
            // Redirection handled by useEffect
        } catch (err) {
            setError(err.message || 'Failed to login with Google.');
            console.error('Google Login Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 font-inter">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 border border-gray-200">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">Project Manager</h1>
                    <h2 className="text-2xl font-semibold text-gray-800">Welcome Back!</h2>
                    <p className="text-gray-600 mt-2">Log in to your account to continue.</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                        <strong className="font-bold">Error! </strong>
                        <span className="block sm:inline">{error}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                            <svg onClick={() => setError('')} className="fill-current h-6 w-6 text-red-500 cursor-pointer" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                        </span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <>
                                Login <ArrowRightIcon className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="relative flex items-center justify-center my-8">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-500">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                    onClick={handleGoogleLogin} // Call the new handler
                    disabled={isLoading}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    <Image src="https://www.svgrepo.com/show/355037/google.svg" alt="Google logo" width={24} height={24} className="mr-3" />
                    Continue with Google
                </button>

                <p className="mt-8 text-center text-gray-600">
    Don&apos;t have an account?{' '} {/* Changed here */}
    <a href="/signup" className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline transition duration-200">
        Sign up here
    </a>
</p>
            </div>
        </div>
    );
}
