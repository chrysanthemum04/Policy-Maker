export function LoadingSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="space-y-3">
                <div className="h-10 bg-[var(--muted)]/30 rounded-lg w-2/3"></div>
                <div className="h-5 bg-[var(--muted)]/20 rounded w-1/2"></div>
            </div>

            {/* Cards Skeleton */}
            <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="glass-card p-6 space-y-4">
                        <div className="w-12 h-12 bg-[var(--muted)]/30 rounded-xl"></div>
                        <div className="h-6 bg-[var(--muted)]/30 rounded w-3/4"></div>
                        <div className="h-4 bg-[var(--muted)]/20 rounded w-full"></div>
                        <div className="h-4 bg-[var(--muted)]/20 rounded w-5/6"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="glass-card p-6 space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--muted)]/30 rounded-full"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[var(--muted)]/30 rounded w-1/3"></div>
                    <div className="h-3 bg-[var(--muted)]/20 rounded w-1/4"></div>
                </div>
            </div>
            <div className="h-5 bg-[var(--muted)]/30 rounded w-full"></div>
            <div className="h-4 bg-[var(--muted)]/20 rounded w-full"></div>
            <div className="h-4 bg-[var(--muted)]/20 rounded w-4/5"></div>
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="glass-card overflow-hidden">
            <div className="divide-y divide-[var(--border)] animate-pulse">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="p-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-[var(--muted)]/30 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-[var(--muted)]/30 rounded w-2/3"></div>
                            <div className="h-3 bg-[var(--muted)]/20 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
