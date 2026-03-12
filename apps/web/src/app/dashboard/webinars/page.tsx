/**
 * Webinars Page
 * Browse and register for expert-hosted educational events
 */

'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Video, ExternalLink } from 'lucide-react';

interface Webinar {
    id: string;
    title: string;
    description: string;
    scheduledAt: string;
    externalLink?: string;
    tags: string[];
    expert: {
        id: string;
        name: string;
        bio?: string;
        expertise?: string[];
    };
}

export default function WebinarsPage() {
    const [webinars, setWebinars] = useState<Webinar[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'upcoming' | 'all'>('upcoming');

    useEffect(() => {
        fetchWebinars();
    }, [filter]);

    const fetchWebinars = async () => {
        try {
            const response = await fetch(`/api/webinars?upcoming=${filter === 'upcoming'}`);
            const data = await response.json();
            setWebinars(data.webinars || []);
        } catch (error) {
            console.error('Error fetching webinars:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="institutional-heading text-4xl mb-3">
                    Educational Webinars
                </h1>
                <p className="text-text-secondary text-lg">
                    Learn from policy experts through live educational sessions
                </p>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setFilter('upcoming')}
                    className={filter === 'upcoming' ? 'btn-primary' : 'btn-secondary'}
                >
                    Upcoming
                </button>
                <button
                    onClick={() => setFilter('all')}
                    className={filter === 'all' ? 'btn-primary' : 'btn-secondary'}
                >
                    All Webinars
                </button>
            </div>

            {/* Webinars List */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-text-muted">Loading webinars...</p>
                </div>
            ) : webinars.length === 0 ? (
                <div className="card text-center py-12">
                    <Video className="w-12 h-12 text-text-muted mx-auto mb-3" />
                    <p className="text-text-muted">No webinars scheduled</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {webinars.map((webinar) => (
                        <div key={webinar.id} className="card-elevated">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="bg-authority text-white rounded-lg p-3 text-center flex-shrink-0">
                                    <p className="text-xs font-medium">
                                        {formatDate(webinar.scheduledAt).split(' ')[1].toUpperCase()}
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {formatDate(webinar.scheduledAt).split(' ')[0]}
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <h3 className="institutional-heading text-xl mb-2">
                                        {webinar.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-text-muted mb-2">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {formatTime(webinar.scheduledAt)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {webinar.description && (
                                <p className="text-text-secondary mb-4 line-clamp-2">
                                    {webinar.description}
                                </p>
                            )}

                            {/* Expert Info */}
                            <div className="flex items-center gap-3 mb-4 p-3 bg-surface rounded-lg">
                                <div className="w-10 h-10 rounded-full bg-authority text-white flex items-center justify-center font-semibold">
                                    {webinar.expert.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-text-primary">
                                        {webinar.expert.name}
                                    </p>
                                    {webinar.expert.expertise && webinar.expert.expertise.length > 0 && (
                                        <p className="text-xs text-text-muted">
                                            {webinar.expert.expertise.slice(0, 2).join(', ')}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Tags */}
                            {webinar.tags && webinar.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {webinar.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs px-2 py-1 bg-surface rounded-full text-text-secondary"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Action */}
                            {webinar.externalLink ? (
                                <a
                                    href={webinar.externalLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary w-full flex items-center justify-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Join Webinar
                                </a>
                            ) : (
                                <button className="btn-secondary w-full">
                                    Register
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
