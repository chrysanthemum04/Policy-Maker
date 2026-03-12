'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, MessageCircle, Share2, Bookmark, MoreHorizontal, TrendingUp, Users, Clock, Search, Filter, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePosts } from '@/hooks/usePosts';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { ErrorState } from '@/components/common/ErrorState';

const trendingHubs = [
    { name: 'Income Tax', members: '45.2K', color: 'bg-primary' },
    { name: 'GST Updates', members: '32.1K', color: 'bg-primary/80' },
    { name: 'Farm Policies', members: '28.5K', color: 'bg-primary/60' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function CommunityPage() {
    const [filter, setFilter] = useState<'trending' | 'new' | 'following'>('trending');
    const { posts, isLoading, error, toggleUpvote, toggleBookmark, refetch } = usePosts(filter);

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (error) {
        return <ErrorState message={error} retry={refetch} />;
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="w-6 h-6 text-[#0244c8]" />
                        <span className="text-sm font-medium text-[#0244c8]">Community</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">Community Discussions</h1>
                </div>
                <Link href="/dashboard/community/new">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary flex items-center gap-2 px-5 py-2.5"
                    >
                        <Plus className="w-4 h-4" /> New Post
                    </motion.button>
                </Link>
            </motion.div>

            {/* Search & Filter */}
            <motion.div variants={itemVariants} className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                    <input
                        type="text"
                        placeholder="Search discussions..."
                        className="glass-input pl-12"
                    />
                </div>
                <button className="px-4 py-3 glass-card hover:border-[var(--primary)]/30 transition-colors rounded-xl">
                    <Filter className="w-5 h-5" />
                </button>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div variants={itemVariants} className="flex gap-2">
                {[
                    { key: 'trending', label: 'Trending', icon: TrendingUp, color: '#d7191f' },
                    { key: 'new', label: 'New', icon: Clock, color: '#0244c8' },
                    { key: 'following', label: 'Following', icon: Users, color: '#ba7b34' }
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${filter === tab.key
                            ? 'text-white shadow-lg'
                            : 'glass-card text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                            }`}
                        style={filter === tab.key ? { backgroundColor: tab.color } : {}}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </motion.div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-[1fr_300px] gap-6">
                {/* Posts */}
                <div className="space-y-4">
                    {posts.map((post) => (
                        <motion.article
                            key={post.id}
                            variants={itemVariants}
                            whileHover={{ y: -2 }}
                            className="glass-card p-5 group"
                        >
                            {/* Author */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-[var(--muted)]/50 flex items-center justify-center text-xl">
                                    {post.author.avatar}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-[var(--foreground)]">{post.author.name}</span>
                                        <span
                                            className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                                            style={{ backgroundColor: post.author.badgeColor }}
                                        >
                                            ✓ {post.author.badge}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span>{post.hubLabel || 'General'}</span>
                                        <span>•</span>
                                        <span>{new Date(post.createdAt!).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Content */}
                            <Link href={`/dashboard/community/${post.id}`}>
                                <h2 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[var(--primary)] transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {post.excerpt}
                                </p>
                            </Link>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {post.tags && post.tags.map((tag) => (
                                    <span key={tag} className="px-2 py-1 rounded-lg bg-gray-100 text-xs text-gray-600">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                                <button
                                    onClick={() => toggleUpvote(post.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-sm ${post.isUpvoted
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                        }`}
                                >
                                    <ThumbsUp className="w-3.5 h-3.5" />
                                    <span>{post.upvotes}</span>
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 text-sm">
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>{post.comments}</span>
                                </button>
                                <button
                                    onClick={() => toggleBookmark(post.id)}
                                    className={`ml-auto p-2 rounded-lg transition-all ${post.isBookmarked
                                        ? 'text-primary bg-primary/5'
                                        : 'text-gray-400 hover:bg-gray-100'
                                        }`}
                                >
                                    <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                                </button>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <motion.div variants={itemVariants} className="glass-card p-5">
                        <h3 className="font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-[#d7191f]" />
                            Trending Hubs
                        </h3>
                        <div className="space-y-2">
                            {trendingHubs.map((hub) => (
                                <Link
                                    key={hub.name}
                                    href={`/dashboard/hubs/${hub.name.toLowerCase().replace(' ', '-')}`}
                                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--muted)]/30 transition-colors"
                                >
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                                        style={{ backgroundColor: hub.color }}
                                    >
                                        {hub.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[var(--foreground)]">{hub.name}</p>
                                        <p className="text-xs text-[var(--muted-foreground)]">{hub.members} members</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
