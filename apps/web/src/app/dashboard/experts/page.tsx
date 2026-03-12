
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, CheckCircle, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Expert {
    id: string;
    name: string;
    email: string;
    role: string;
    bio: string;
    tags: string[];
    isVerified: boolean;
}

export default function ExpertsPage() {
    const { token } = useAuth();
    const [experts, setExperts] = useState<Expert[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    useEffect(() => {
        fetchExperts();
    }, [searchTerm, selectedTag]);

    const fetchExperts = async () => {
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (selectedTag) params.append('tag', selectedTag);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/experts?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setExperts(data);
            }
        } catch (error) {
            console.error('Failed to fetch experts:', error);
        } finally {
            setLoading(false);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    // Calculate unique tags for filter
    const allTags = Array.from(new Set(experts.flatMap(e => e.tags))).slice(0, 10);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="institutional-heading text-4xl mb-2">Policy Experts</h1>
                    <p className="text-text-secondary max-w-2xl">
                        Connect with verified professionals, researchers, and field specialists to gain deeper insights into policy matters.
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="card-elevated p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search experts by name or topic..."
                        className="input pl-10 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    <button
                        onClick={() => setSelectedTag(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!selectedTag
                                ? 'bg-primary text-white'
                                : 'bg-surface border border-border text-text-secondary hover:bg-gray-50'
                            }`}
                    >
                        All Topics
                    </button>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${tag === selectedTag
                                    ? 'bg-primary text-white'
                                    : 'bg-surface border border-border text-text-secondary hover:bg-gray-50'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Experts Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {experts.map((expert) => (
                        <motion.div key={expert.id} variants={item} className="card-elevated group hover:border-primary/50 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center text-primary font-bold text-xl">
                                        {expert.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-text-primary flex items-center gap-1">
                                            {expert.name}
                                            {expert.isVerified && <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500/10" />}
                                        </h3>
                                        <p className="text-sm text-text-secondary">Policy Expert</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-text-secondary text-sm mb-4 line-clamp-3 h-[60px]">
                                {expert.bio || `Specialist in ${expert.tags.join(', ')}.`}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6 h-[56px] overflow-hidden">
                                {expert.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-surface border border-border rounded text-xs font-medium text-text-muted">
                                        {tag}
                                    </span>
                                ))}
                                {expert.tags.length > 3 && (
                                    <span className="px-2 py-1 bg-surface border border-border rounded text-xs font-medium text-text-muted">
                                        +{expert.tags.length - 3}
                                    </span>
                                )}
                            </div>

                            <button className="btn-secondary w-full group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center gap-2">
                                <Mail className="w-4 h-4" />
                                Connect
                            </button>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {!loading && experts.length === 0 && (
                <div className="text-center py-20 text-text-muted bg-surface/50 rounded-xl border border-dashed border-border">
                    <p className="text-lg">No experts found matching your criteria.</p>
                    <button
                        onClick={() => { setSearchTerm(''); setSelectedTag(null); }}
                        className="mt-4 btn-secondary"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
}
