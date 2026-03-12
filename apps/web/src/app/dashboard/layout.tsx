'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    BarChart2,
    Users,
    GraduationCap,
    BookOpen,
    Video,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { InteractiveBackground } from '@/components/ui/InteractiveBackground';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials } from '@/lib/utils';
import { AIAssistant } from '@/components/ai/AIAssistant';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const navigation = [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Simulate', href: '/dashboard/simulate', icon: BarChart2 },
        { name: 'Explain', href: '/dashboard/explain', icon: BookOpen },
        { name: 'Experts', href: '/dashboard/experts', icon: GraduationCap },
        { name: 'Webinars', href: '/dashboard/webinars', icon: Video },
        { name: 'Community', href: '/dashboard/community', icon: MessageSquare },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];

    const displayName = user?.fullName || 'User';
    const userInitials = user?.fullName ? getInitials(user.fullName) : 'U';
    const userRole = user?.role === 'expert' ? 'Expert' : user?.role === 'government' ? 'Government' : 'Citizen';

    return (
        <div className="min-h-screen text-[var(--foreground)] relative overflow-hidden flex">
            <InteractiveBackground />
            <AIAssistant />

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                className={`
          fixed md:relative z-50 h-screen w-72 
          glass border-r border-[var(--glass-border)]
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
            >
                <div className="p-6 flex flex-col h-full">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 mb-10 group">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                            <Image src="/logo.png" alt="PolicyWave Logo" width={40} height={40} className="w-full h-full object-contain p-1" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">PolicyWave</span>
                        {/* Close button for mobile */}
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="md:hidden ml-auto text-[var(--muted-foreground)]"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </Link>

                    {/* Nav Links */}
                    <nav className="flex-1 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.name} href={item.href}>
                                    <div className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive
                                            ? 'bg-[var(--primary)]/10 text-[var(--primary)] shadow-sm border border-[var(--primary)]/10 font-bold'
                                            : 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]'}
                  `}>
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.name}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="pt-6 border-t border-[var(--border)] mt-auto">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0244c8] to-[#5187e4] flex items-center justify-center text-white font-bold">
                                {userInitials}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate text-[var(--foreground)]">{displayName}</p>
                                <p className="text-xs text-[var(--muted-foreground)] truncate">{userRole}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--muted-foreground)] hover:bg-red-500/10 hover:text-red-500 transition-colors w-full"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
                {/* Top Header */}
                <header className="h-20 glass border-b border-[var(--glass-border)] flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden p-2 text-[var(--foreground)]"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold md:hidden">Dashboard</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                    </div>
                </header>

                {/* Scrollable Page Content */}
                <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
