/**
 * Main Dashboard - PolicyWave
 * Role-based dashboard with consistent theme
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';



export default function DashboardPage() {
    const router = useRouter();
    const { user, isLoading, logout } = useAuth();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background-light flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-[#1c0c0e]/60">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const roleConfig = {
        citizen: {
            icon: 'groups',
            title: 'Citizen Dashboard',
            description: 'Participate in policy simulations and discussions',
            primaryAction: { label: 'Start Simulation', href: '/dashboard/simulate' },
            cards: [
                { title: 'My Simulations', value: '0', icon: 'psychology', href: '/dashboard/simulate' },
                { title: 'Policy Domains', value: '10', icon: 'category', href: '/dashboard/explain' },
                { title: 'Webinars', value: 'View', icon: 'event', href: '/dashboard/webinars' },
            ],
        },
        government: {
            icon: 'account_balance',
            title: 'Government Dashboard',
            description: 'Model policy impacts and analyze scenarios',
            primaryAction: { label: 'Create Simulation', href: '/dashboard/government' },
            cards: [
                { title: 'Active Simulations', value: '0', icon: 'analytics', href: '/dashboard/government' },
                { title: 'Policy Domains', value: '10', icon: 'category', href: '/dashboard/explain' },
                { title: 'Reports', value: 'View', icon: 'description', href: '/dashboard/government' },
            ],
        },
        expert: {
            icon: 'psychology',
            title: 'Expert Dashboard',
            description: 'Provide insights and host webinars',
            primaryAction: { label: 'Create Webinar', href: '/dashboard/expert' },
            cards: [
                { title: 'My Webinars', value: '0', icon: 'event', href: '/dashboard/expert' },
                { title: 'Simulations Reviewed', value: '0', icon: 'fact_check', href: '/dashboard/expert' },
                { title: 'Policy Domains', value: '10', icon: 'category', href: '/dashboard/explain' },
            ],
        },
    };

    const config = roleConfig[user.role];

    // Safety check: if role is invalid, redirect to landing page
    if (!config) {
        console.error('Invalid user role:', user.role);
        localStorage.removeItem('token');
        router.push('/');
        return null;
    }

    return (
        <div className="min-h-screen bg-background-light">
            {/* Navigation */}
            <nav className="border-b border-primary/10 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-2xl text-primary">account_balance</span>
                            <h1 className="text-xl font-bold font-display">PolicyWave</h1>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                                Dashboard
                            </Link>
                            <Link href="/dashboard/explain" className="text-sm font-medium hover:text-primary transition-colors">
                                Explore
                            </Link>
                            <Link href="/dashboard/webinars" className="text-sm font-medium hover:text-primary transition-colors">
                                Webinars
                            </Link>
                            <button
                                onClick={logout}
                                className="px-4 py-2 rounded-lg border border-primary/20 text-primary text-sm font-bold hover:bg-primary/5 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Welcome Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-primary">{config.icon}</span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold font-display text-[#1c0c0e]">
                                Welcome back, {user.fullName}
                            </h2>
                            <p className="text-[#1c0c0e]/60 mt-1">{config.description}</p>
                        </div>
                    </div>

                    <Link
                        href={config.primaryAction.href}
                        className="btn-primary gap-2"
                    >
                        {config.primaryAction.label}
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {config.cards.map((card, index) => (
                        <Link
                            key={index}
                            href={card.href}
                            className="group card-elevated hover:border-primary hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="material-symbols-outlined text-3xl text-primary/60 group-hover:text-primary transition-colors">
                                    {card.icon}
                                </span>
                                <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    arrow_forward
                                </span>
                            </div>
                            <h3 className="text-sm font-bold text-[#1c0c0e]/60 mb-1">{card.title}</h3>
                            <p className="text-2xl font-bold text-[#1c0c0e]">{card.value}</p>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-primary/10 p-8">
                    <h3 className="text-xl font-bold font-display text-[#1c0c0e] mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            href="/dashboard/simulate"
                            className="flex items-center gap-4 p-4 rounded-lg border border-primary/10 hover:border-primary hover:bg-primary/5 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-2xl text-primary group-hover:text-white">psychology</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-[#1c0c0e]">Run Simulation</h4>
                                <p className="text-sm text-[#1c0c0e]/60">Test policy scenarios</p>
                            </div>
                            <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>

                        <Link
                            href="/dashboard/explain"
                            className="flex items-center gap-4 p-4 rounded-lg border border-primary/10 hover:border-primary hover:bg-primary/5 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-2xl text-primary group-hover:text-white">menu_book</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-[#1c0c0e]">Explore Policies</h4>
                                <p className="text-sm text-[#1c0c0e]/60">Learn about policy domains</p>
                            </div>
                            <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>

                        <Link
                            href="/dashboard/webinars"
                            className="flex items-center gap-4 p-4 rounded-lg border border-primary/10 hover:border-primary hover:bg-primary/5 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-2xl text-primary group-hover:text-white">event</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-[#1c0c0e]">Join Webinars</h4>
                                <p className="text-sm text-[#1c0c0e]/60">Learn from experts</p>
                            </div>
                            <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>

                        <Link
                            href="/dashboard/community"
                            className="flex items-center gap-4 p-4 rounded-lg border border-primary/10 hover:border-primary hover:bg-primary/5 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-2xl text-primary group-hover:text-white">forum</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-[#1c0c0e]">Community</h4>
                                <p className="text-sm text-[#1c0c0e]/60">Join discussions</p>
                            </div>
                            <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
