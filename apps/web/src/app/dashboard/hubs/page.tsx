'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, TrendingUp, MessageSquare, Plus, Bell, Sparkles } from 'lucide-react';
import Link from 'next/link';

const allHubs = [
    {
        id: 'income-tax',
        name: 'Income Tax',
        description: 'Discussions on income tax, old vs new regime, deductions, and filing.',
        members: 45200,
        posts: 1234,
        color: '#0244c8',
        isSubscribed: true,
        trending: true
    },
    {
        id: 'gst',
        name: 'GST Updates',
        description: 'Latest GST changes, rate updates, filing tips, and compliance.',
        members: 32100,
        posts: 876,
        color: '#5187e4',
        isSubscribed: true,
        trending: true
    },
    {
        id: 'farming',
        name: 'Farm Policies',
        description: 'PM-KISAN, MSP, subsidies, crop insurance, and agricultural reforms.',
        members: 28500,
        posts: 654,
        color: '#ba7b34',
        isSubscribed: false,
        trending: true
    },
    {
        id: 'startup',
        name: 'Startups & DPIIT',
        description: 'Startup India benefits, angel tax, ESOP taxation, and funding.',
        members: 21300,
        posts: 432,
        color: '#d7191f',
        isSubscribed: false,
        trending: false
    },
    {
        id: 'healthcare',
        name: 'Healthcare Policies',
        description: 'Ayushman Bharat, 80D deductions, CGHS, and health reforms.',
        members: 18900,
        posts: 321,
        color: '#d7191f',
        isSubscribed: false,
        trending: false
    },
    {
        id: 'education',
        name: 'Education & Scholarships',
        description: 'Education loans, scholarships, NEP 2020, and student benefits.',
        members: 15600,
        posts: 287,
        color: '#fbcf0c',
        isSubscribed: false,
        trending: false
    },
    {
        id: 'real-estate',
        name: 'Real Estate & Property',
        description: 'Home loans, capital gains, RERA, stamp duty, and property tax.',
        members: 12400,
        posts: 198,
        color: '#0244c8',
        isSubscribed: false,
        trending: false
    },
    {
        id: 'pension',
        name: 'Pension & Retirement',
        description: 'NPS, EPF, PPF, senior citizen benefits, and retirement planning.',
        members: 9800,
        posts: 156,
        color: '#ba7b34',
        isSubscribed: true,
        trending: false
    }
];

export default function HubsPage() {
    const [hubs, setHubs] = useState(allHubs);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'subscribed' | 'trending'>('all');

    const toggleSubscribe = (hubId: string) => {
        setHubs(hubs.map(h =>
            h.id === hubId ? { ...h, isSubscribed: !h.isSubscribed } : h
        ));
    };

    const filteredHubs = hubs.filter(hub => {
        const matchesSearch = hub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hub.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'subscribed' && hub.isSubscribed) ||
            (filter === 'trending' && hub.trending);
        return matchesSearch && matchesFilter;
    });

    const formatNumber = (num: number) => {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <main className="min-h-screen bg-[var(--background)]">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none" style={{ background: 'var(--gradient-mesh)' }} />

            {/* Animated Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-20 left-1/4 w-96 h-96 bg-[#0244c8]/15 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-20 -right-20 w-80 h-80 bg-[#ba7b34]/15 rounded-full blur-3xl"
                />
            </div>

            <div className="max-w-6xl mx-auto px-6 pt-28 pb-16 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-10"
                >
                    <div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-[var(--primary)] text-sm font-medium mb-4"
                        >
                            <Sparkles className="w-4 h-4" />
                            Policy Communities
                        </motion.div>
                        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">Policy Hubs</h1>
                        <p className="text-[var(--muted-foreground)]">Join communities focused on specific policy topics</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(2, 68, 200, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary flex items-center gap-2 px-6 py-3"
                    >
                        <Plus className="w-4 h-4" /> Create Hub
                    </motion.button>
                </motion.div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                >
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search hubs..."
                            className="glass-input pl-12"
                        />
                    </div>
                </motion.div>

                {/* Filter Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-2 mb-10"
                >
                    {[
                        { key: 'all', label: 'All Hubs', color: '#5187e4' },
                        { key: 'subscribed', label: 'Subscribed', color: '#0244c8' },
                        { key: 'trending', label: 'Trending', color: '#d7191f' }
                    ].map((tab) => (
                        <motion.button
                            key={tab.key}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setFilter(tab.key as any)}
                            className={`px-5 py-2.5 rounded-full font-medium transition-all ${filter === tab.key
                                    ? 'text-white shadow-lg'
                                    : 'glass-card text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                                }`}
                            style={filter === tab.key ? { backgroundColor: tab.color } : {}}
                        >
                            {tab.label}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Hubs Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {filteredHubs.map((hub, i) => (
                        <motion.div
                            key={hub.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                            whileHover={{ y: -6 }}
                            className="relative glass-card p-6 group overflow-hidden"
                            style={{ borderColor: `${hub.color}20` }}
                        >
                            {/* Hover glow */}
                            <motion.div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{ background: `radial-gradient(circle at 0% 100%, ${hub.color}10 0%, transparent 50%)` }}
                            />

                            {hub.trending && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", delay: 0.4 + i * 0.05 }}
                                    className="absolute -top-2 -right-2 px-3 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-lg"
                                    style={{ backgroundColor: '#d7191f' }}
                                >
                                    <TrendingUp className="w-3 h-3" /> Trending
                                </motion.div>
                            )}

                            <div className="flex gap-4 relative z-10">
                                <motion.div
                                    whileHover={{ rotate: 5, scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-lg"
                                    style={{
                                        backgroundColor: hub.color,
                                        boxShadow: `0 10px 25px -5px ${hub.color}40`
                                    }}
                                >
                                    {hub.name.charAt(0)}
                                </motion.div>

                                <div className="flex-1">
                                    <Link href={`/hubs/${hub.id}`}>
                                        <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors mb-1">
                                            {hub.name}
                                        </h3>
                                    </Link>
                                    <p className="text-sm text-[var(--muted-foreground)] mb-3 line-clamp-2">
                                        {hub.description}
                                    </p>

                                    <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {formatNumber(hub.members)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageSquare className="w-4 h-4" />
                                            {formatNumber(hub.posts)} posts
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-5 relative z-10">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => toggleSubscribe(hub.id)}
                                    className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${hub.isSubscribed
                                            ? 'text-white shadow-md'
                                            : 'glass-card text-[var(--foreground)] hover:border-[var(--primary)]/30'
                                        }`}
                                    style={hub.isSubscribed ? { backgroundColor: hub.color } : {}}
                                >
                                    {hub.isSubscribed ? '✓ Subscribed' : 'Subscribe'}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2.5 rounded-xl glass-card text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                                >
                                    <Bell className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredHubs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-[var(--muted-foreground)] text-lg">No hubs found matching your search.</p>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
