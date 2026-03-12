'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
    title?: string;
    message?: string;
    retry?: () => void;
}

export function ErrorState({
    title = 'Something went wrong',
    message = 'An error occurred while loading this content.',
    retry
}: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{title}</h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-6 max-w-md">{message}</p>
            {retry && (
                <button
                    onClick={retry}
                    className="btn btn-primary flex items-center gap-2 px-4 py-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                </button>
            )}
        </div>
    );
}

export function EmptyState({
    title = 'No data available',
    message = 'There is no content to display at the moment.',
    icon: Icon,
    action
}: {
    title?: string;
    message?: string;
    icon?: React.ComponentType<{ className?: string }>;
    action?: { label: string; onClick: () => void };
}) {
    const IconComponent = Icon || AlertTriangle;

    return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--muted)]/30 flex items-center justify-center mb-4">
                <IconComponent className="w-8 h-8 text-[var(--muted-foreground)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{title}</h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-6 max-w-md">{message}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="btn btn-primary px-4 py-2"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
