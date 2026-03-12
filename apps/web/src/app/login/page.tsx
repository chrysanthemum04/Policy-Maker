/**
 * Login Page - PolicyWave
 * Matching the landing page design theme
 */

'use client';

import { useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData);
            // Redirect is handled by AuthContext
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light px-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-3 mb-8 group">
                    <Image src="/logo.png" alt="PolicyWave" width={48} height={48} className="w-12 h-12 object-contain" />
                    <h1 className="text-2xl font-bold font-display text-[#1c0c0e]">PolicyWave</h1>
                </Link>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-primary/5">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold font-display text-[#1c0c0e] mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-[#1c0c0e]/60">
                            Sign in to continue to your dashboard
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-[#1c0c0e] mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full h-12 px-4 rounded-lg bg-background-light border border-primary/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#1c0c0e] mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full h-12 px-4 rounded-lg bg-background-light border border-primary/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="rounded border-primary/20 text-primary focus:ring-primary"
                                />
                                <span className="text-[#1c0c0e]/70">Remember me</span>
                            </label>
                            <a href="#" className="text-primary font-bold hover:underline">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 rounded-lg bg-primary text-white text-lg font-bold hover:bg-primary/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-[#1c0c0e]/60">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-primary font-bold hover:underline">
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <div className="flex justify-center gap-6 text-sm text-[#1c0c0e]/60">
                        <a href="#" className="hover:text-primary">Privacy</a>
                        <a href="#" className="hover:text-primary">Terms</a>
                        <a href="#" className="hover:text-primary">Contact</a>
                    </div>
                    <p className="mt-4 text-xs text-[#1c0c0e]/40">
                        © 2024 PolicyWave Platform. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
