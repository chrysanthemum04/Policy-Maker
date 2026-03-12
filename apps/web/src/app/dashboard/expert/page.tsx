/**
 * Expert Dashboard
 * Educational content, webinars, and analytical tools
 */

'use client';

import { useState } from 'react';
import { Video, BookOpen, MessageSquare, Calendar } from 'lucide-react';

export default function ExpertDashboard() {
    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="institutional-heading text-4xl mb-2">
                    Expert Dashboard
                </h1>
                <p className="text-text-secondary">
                    Share knowledge and host educational webinars
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Quick Stats */}
                <div className="card">
                    <div className="flex items-center gap-3 mb-2">
                        <Video className="w-5 h-5 text-info" />
                        <h3 className="font-semibold">Webinars Hosted</h3>
                    </div>
                    <p className="text-3xl font-bold text-text-primary">12</p>
                    <p className="text-sm text-text-muted">Total sessions</p>
                </div>

                <div className="card">
                    <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="w-5 h-5 text-success" />
                        <h3 className="font-semibold">Simulations Run</h3>
                    </div>
                    <p className="text-3xl font-bold text-text-primary">45</p>
                    <p className="text-sm text-text-muted">This quarter</p>
                </div>

                <div className="card">
                    <div className="flex items-center gap-3 mb-2">
                        <MessageSquare className="w-5 h-5 text-authority" />
                        <h3 className="font-semibold">Community Posts</h3>
                    </div>
                    <p className="text-3xl font-bold text-text-primary">28</p>
                    <p className="text-sm text-text-muted">Published</p>
                </div>
            </div>

            {/* Upcoming Webinars */}
            <div className="card-elevated mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="institutional-heading text-2xl">
                        Your Webinars
                    </h2>
                    <button className="btn-primary">
                        Schedule New
                    </button>
                </div>

                <div className="space-y-3">
                    {[
                        {
                            title: 'Understanding Tax Reform Implications',
                            date: '2026-01-20',
                            time: '14:00',
                            attendees: 45,
                        },
                        {
                            title: 'Healthcare Policy Analysis Workshop',
                            date: '2026-01-25',
                            time: '16:00',
                            attendees: 32,
                        },
                    ].map((webinar, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                            <div className="flex items-start gap-4">
                                <div className="bg-authority text-white rounded-lg p-3 text-center">
                                    <p className="text-xs font-medium">JAN</p>
                                    <p className="text-2xl font-bold">{webinar.date.split('-')[2]}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-text-primary mb-1">
                                        {webinar.title}
                                    </h3>
                                    <p className="text-sm text-text-muted">
                                        {webinar.time} • {webinar.attendees} registered
                                    </p>
                                </div>
                            </div>
                            <button className="btn-secondary">
                                Manage
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                    <h3 className="institutional-heading text-xl mb-4">
                        Run Simulation
                    </h3>
                    <p className="text-text-secondary mb-4">
                        Analyze policy scenarios with AI-powered simulations
                    </p>
                    <button className="btn-primary w-full">
                        Start Simulation
                    </button>
                </div>

                <div className="card">
                    <h3 className="institutional-heading text-xl mb-4">
                        Community Discussion
                    </h3>
                    <p className="text-text-secondary mb-4">
                        Engage in policy discussions and share insights
                    </p>
                    <button className="btn-primary w-full">
                        View Discussions
                    </button>
                </div>
            </div>
        </div>
    );
}
