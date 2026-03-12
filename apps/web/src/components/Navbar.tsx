'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calculator, Users, BookOpen, UserCircle, Home, MessageSquare, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/simulator', label: 'Simulate', icon: Calculator },
    { href: '/community', label: 'Community', icon: MessageSquare },
    { href: '/hubs', label: 'Hubs', icon: BookOpen },
    { href: '/experts', label: 'Experts', icon: Users },
];

export default function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--glass-border)]"
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <motion.div
                        whileHover={{ rotate: 180, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="w-8 h-8 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white font-bold text-lg shadow-sm"
                    >
                        ◆
                    </motion.div>
                    <span className="text-xl font-bold tracking-tight text-[var(--foreground)]">PolicyWave</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-[var(--primary)] text-white'
                                        : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]'
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <div className="hidden md:block h-6 w-px bg-[var(--border)]" />
                    <Link href="/login" className="hidden md:block text-sm font-medium hover:text-[var(--primary)] transition-colors">
                        Log in
                    </Link>
                    <Link href="/register" className="hidden md:block">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-primary text-sm px-5 py-2"
                        >
                            Sign up
                        </motion.button>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-[var(--muted)]"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden border-t border-[var(--border)] bg-[var(--background)]"
                >
                    <div className="p-4 space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                                            ? 'bg-[var(--primary)] text-white'
                                            : 'text-[var(--foreground)] hover:bg-[var(--muted)]'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                        <div className="pt-4 border-t border-[var(--border)] flex gap-2">
                            <Link href="/login" className="flex-1">
                                <button className="w-full py-2 rounded-lg border border-[var(--border)] font-medium">
                                    Log in
                                </button>
                            </Link>
                            <Link href="/register" className="flex-1">
                                <button className="w-full py-2 rounded-lg bg-[var(--primary)] text-white font-medium">
                                    Sign up
                                </button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}
