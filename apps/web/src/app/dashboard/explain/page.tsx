/**
 * Policy Explanation Interface
 * Simple, educational explanations of policies
 */

'use client';

import { useState } from 'react';
import { Search, BookOpen, Info } from 'lucide-react';

export default function ExplainPage() {
    const [query, setQuery] = useState('');
    const [explanation, setExplanation] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            // TODO: Call explanation API
            const response = await fetch('/api/simulations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode: 'explanation',
                    policyDomainId: 'general',
                    userInput: query,
                }),
            });

            const data = await response.json();
            setExplanation(data.output);
        } catch (error) {
            console.error('Explanation error:', error);
        } finally {
            setLoading(false);
        }
    };

    const popularTopics = [
        'What is GST?',
        'How does income tax work?',
        'What are farm subsidies?',
        'Explain universal healthcare',
        'What is minimum wage?',
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8 text-center">
                <h1 className="institutional-heading text-4xl mb-3">
                    Policy Explanations
                </h1>
                <p className="text-text-secondary text-lg">
                    Get clear, simple explanations of policies and their impacts
                </p>
            </div>

            {/* Search */}
            <div className="card-elevated mb-8">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask about any policy..."
                            className="input pl-10"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !query.trim()}
                        className="btn-primary"
                    >
                        {loading ? 'Searching...' : 'Explain'}
                    </button>
                </form>

                {/* Popular Topics */}
                {!explanation && (
                    <div className="mt-4">
                        <p className="text-sm text-text-muted mb-2">Popular topics:</p>
                        <div className="flex flex-wrap gap-2">
                            {popularTopics.map((topic) => (
                                <button
                                    key={topic}
                                    onClick={() => setQuery(topic)}
                                    className="text-sm px-3 py-1 bg-surface rounded-full hover:bg-surface-muted transition-colors"
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Explanation Result */}
            {explanation && (
                <div className="card-elevated">
                    <div className="flex items-start gap-3 mb-4">
                        <BookOpen className="w-6 h-6 text-authority flex-shrink-0 mt-1" />
                        <div className="flex-1">
                            <h2 className="institutional-heading text-2xl mb-4">
                                Explanation
                            </h2>

                            <div className="prose prose-lg max-w-none">
                                <p className="text-text-secondary leading-relaxed">
                                    {explanation.extendedReport?.expandedReasoning ||
                                        explanation.briefSummary?.keyImpacts?.join(' ') ||
                                        'No explanation available.'}
                                </p>
                            </div>

                            {/* Confidence */}
                            {explanation.confidenceLevel && (
                                <div className="mt-6 pt-4 border-t border-border-light">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Info className="w-4 h-4 text-text-muted" />
                                        <span className="text-text-muted">Confidence Level:</span>
                                        <span className={`confidence-${explanation.confidenceLevel} font-medium`}>
                                            {explanation.confidenceLevel.toUpperCase()}
                                        </span>
                                    </div>
                                    {explanation.confidenceExplanation && (
                                        <p className="text-sm text-text-secondary mt-2">
                                            {explanation.confidenceExplanation}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Assumptions */}
                            {explanation.detailedAnalysis?.assumptions &&
                                explanation.detailedAnalysis.assumptions.length > 0 && (
                                    <div className="mt-4 p-4 bg-surface rounded-lg">
                                        <p className="text-sm font-medium text-text-primary mb-2">
                                            Key Assumptions:
                                        </p>
                                        <ul className="text-sm text-text-secondary space-y-1">
                                            {explanation.detailedAnalysis.assumptions.map((assumption: string, idx: number) => (
                                                <li key={idx}>• {assumption}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setExplanation(null);
                            setQuery('');
                        }}
                        className="btn-secondary w-full mt-4"
                    >
                        Ask Another Question
                    </button>
                </div>
            )}
        </div>
    );
}
