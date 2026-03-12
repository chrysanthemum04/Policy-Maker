
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Check, ChevronDown, User, Monitor, Building2 } from 'lucide-react';
import { InteractiveBackground } from '@/components/ui/InteractiveBackground';
import { ParallaxTilt } from '@/components/ui/ParallaxTilt';

type Role = 'citizen' | 'expert' | 'government';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<Role>('citizen');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        // Expert fields
        bio: '',
        expertiseTags: '', // Comma separated string for input
        // Citizen fields
        locationRegion: '',
        occupationCategory: '',
        // Common
        profession: '' // Mapping to occupationCategory for simplicity or kept separate
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const professions = [
        'Business Owner', 'Chartered Accountant', 'Developer/Engineer', 'Economist',
        'Farmer', 'Government Employee', 'Healthcare Professional', 'Lawyer',
        'Researcher', 'Student', 'Other'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const body = {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                role: role,
                // Conditional fields
                ...(role === 'expert' ? {
                    bio: formData.bio,
                    expertiseTags: formData.expertiseTags.split(',').map(t => t.trim()).filter(Boolean)
                } : {}),
                ...(role === 'citizen' ? {
                    locationRegion: formData.locationRegion,
                    occupationCategory: formData.profession // Using profession dropdown
                } : {})
            };

            const res = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error?.message || 'Registration failed');
            }

            // Store token and redirect
            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const passwordStrength = () => {
        const { password } = formData;
        if (password.length === 0) return { score: 0, label: '' };
        if (password.length < 6) return { score: 1, label: 'Weak', color: 'var(--coral)' };
        if (password.length < 10) return { score: 2, label: 'Good', color: 'var(--gold)' };
        return { score: 3, label: 'Strong', color: 'var(--mint)' };
    };

    const strength = passwordStrength();

    return (
        <main className="min-h-screen flex items-center justify-center px-6 py-12 text-[var(--foreground)] relative overflow-hidden">
            <InteractiveBackground />

            <ParallaxTilt perspective={2000} intensity={5} className="relative z-10 w-full max-w-lg my-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to home
                    </Link>

                    <div className="glass-card p-10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
                                Create your account
                            </h1>
                            <p className="text-[var(--muted-foreground)] mt-2 text-sm">
                                Join thousands understanding policy impact
                            </p>
                        </div>

                        {/* Role Selector */}
                        <div className="grid grid-cols-3 gap-2 mb-8 bg-surface-dark/50 p-1 rounded-xl border border-white/10">
                            {[
                                { id: 'citizen', label: 'Citizen', icon: User },
                                { id: 'expert', label: 'Expert', icon: Monitor },
                                { id: 'government', label: 'Govt.', icon: Building2 },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setRole(item.id as Role)}
                                    className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all text-xs font-medium ${role === item.id
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-[var(--muted-foreground)] hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="glass-input"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="glass-input"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            {/* Conditional Fields Based on Role */}
                            {role === 'citizen' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Location (Region)</label>
                                        <input
                                            type="text"
                                            value={formData.locationRegion}
                                            onChange={(e) => setFormData({ ...formData, locationRegion: e.target.value })}
                                            className="glass-input"
                                            placeholder="e.g. Mumbai, Delhi"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Profession</label>
                                        <div className="relative">
                                            <select
                                                value={formData.profession}
                                                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                                                className="glass-input appearance-none cursor-pointer"
                                                required
                                            >
                                                <option value="" disabled>Select profession</option>
                                                {professions.map((p) => (
                                                    <option key={p} value={p}>{p}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {role === 'expert' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Bio / Title</label>
                                        <input
                                            type="text"
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            className="glass-input"
                                            placeholder="e.g. Senior Economist at PolicyInst"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Expertise Tags (comma separated)</label>
                                        <input
                                            type="text"
                                            value={formData.expertiseTags}
                                            onChange={(e) => setFormData({ ...formData, expertiseTags: e.target.value })}
                                            className="glass-input"
                                            placeholder="e.g. Taxation, Healthcare, Law"
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            {role === 'government' && (
                                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-600 dark:text-blue-400">
                                    Government accounts require manual verification after signup.
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="glass-input pr-12"
                                        placeholder="••••••••"
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {/* Strength Meter */}
                                {formData.password && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex-1 h-1 bg-[var(--border)] rounded-full overflow-hidden">
                                            <div
                                                className="h-full transition-all duration-300"
                                                style={{
                                                    width: `${(strength.score / 3) * 100}%`,
                                                    backgroundColor: strength.color?.replace('var(--coral)', '#ff453a').replace('var(--gold)', '#ffcc00').replace('var(--mint)', '#32d74b') || 'gray',
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium" style={{
                                            color: strength.color?.replace('var(--coral)', '#ff453a').replace('var(--gold)', '#ffcc00').replace('var(--mint)', '#32d74b')
                                        }}>
                                            {strength.label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={isLoading}
                                className="btn btn-primary w-full h-12 text-base shadow-lg shadow-blue-500/20 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        Creating account...
                                    </span>
                                ) : (
                                    'Create Account'
                                )}
                            </motion.button>
                        </form>

                        <p className="text-center text-[var(--muted-foreground)] mt-8 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-[var(--primary)] hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </ParallaxTilt>
        </main>
    );
}
