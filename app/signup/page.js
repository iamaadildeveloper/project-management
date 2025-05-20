'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust the path if needed
import { useRouter } from 'next/navigation'; // Import useRouter

export default function SignupPage() {
    const { googleLogin, signupWithEmail } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const { push } = useRouter(); // Initialize useRouter

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirm) {
            setError("Passwords don't match");
            return;
        }

        try {
            await signupWithEmail(email, password);
            // Redirect to dashboard or another page upon successful signup
            push('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to sign up');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-6 border rounded shadow bg-white">
            <h1 className="text-2xl mb-6 font-semibold">Signup</h1>
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                    className="border px-3 py-2 rounded"
                />
                <button
                    type="submit"
                    className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    Signup
                </button>
            </form>

            <hr className="my-6" />

            <button
                onClick={googleLogin}
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
                Continue with Google
            </button>
        </div>
    );
}