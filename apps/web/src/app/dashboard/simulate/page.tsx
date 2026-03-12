/**
 * Simulation Interface for Citizens
 * Chat-based, conversational UI for policy simulations
 */

'use client';

import { useState } from 'react';
import { Send, Loader2, AlertCircle, Info } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    confidenceLevel?: 'high' | 'medium' | 'low';
    assumptions?: string[];
}

export default function CitizenSimulationPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // TODO: Call simulation API
            const token = localStorage.getItem('token');
            if (!token) {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Authentication error: Please log in again.' }]);
                setLoading(false);
                return;
            }

            const response = await fetch('/api/simulations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    mode: 'simulation',
                    policyDomainId: '00d13e23-701c-4098-a329-b2fbfa3d7d10', // Healthcare domain
                    userInput: input,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMsg = typeof data.error === 'object'
                    ? JSON.stringify(data.error)
                    : data.error || 'Failed to generate simulation';
                throw new Error(errorMsg);
            }

            if (!data.output || !data.output.briefSummary) {
                throw new Error('Invalid response format from AI');
            }

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.output.briefSummary.keyImpacts.join('\n'),
                confidenceLevel: data.output.confidenceLevel,
                assumptions: data.output.detailedAnalysis.assumptions,
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error: any) {
            console.error('Simulation error:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: `Error: ${error.message || 'Something went wrong. Please try again.'}`,
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* First-use AI Disclosure */}
            {showDisclaimer && (
                <div className="simulation-disclaimer mb-6">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-authority mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-text-primary mb-2">
                                About Policy Simulations
                            </h3>
                            <p className="text-sm text-text-secondary mb-3">
                                This AI provides <strong>simulated, directional analysis</strong> based on stated assumptions.
                                It does not predict exact outcomes or claim authority on policy decisions.
                            </p>
                            <ul className="text-sm text-text-secondary space-y-1 mb-3">
                                <li>• Outputs are assumption-driven estimates, not certainties</li>
                                <li>• Confidence levels indicate reliability of analysis</li>
                                <li>• All assumptions are stated explicitly</li>
                                <li>• Use as decision support, not as final authority</li>
                            </ul>
                            <button
                                onClick={() => setShowDisclaimer(false)}
                                className="text-sm text-authority hover:text-authority-hover font-medium"
                            >
                                I understand, continue →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Interface */}
            <div className="card-elevated">
                <h1 className="institutional-heading text-2xl mb-4">
                    Policy Simulation
                </h1>

                {/* Messages */}
                <div className="space-y-4 mb-6 min-h-[400px] max-h-[600px] overflow-y-auto">
                    {messages.length === 0 && (
                        <div className="text-center py-12 text-text-muted">
                            <p className="mb-2">Ask a question about a policy to get started</p>
                            <p className="text-sm">Example: "How would universal healthcare affect my family?"</p>
                        </div>
                    )}

                    {messages.map((message, idx) => (
                        <div
                            key={idx}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user'
                                    ? 'bg-gray-100 text-black border border-gray-200'
                                    : 'bg-surface border border-border-light'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap">{message.content}</p>

                                {message.role === 'assistant' && message.confidenceLevel && (
                                    <div className="mt-3 pt-3 border-t border-border-light">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-text-muted">Confidence:</span>
                                            <span className={`confidence-${message.confidenceLevel}`}>
                                                {message.confidenceLevel.toUpperCase()}
                                            </span>
                                        </div>

                                        {message.assumptions && message.assumptions.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-xs text-text-muted mb-1">Key Assumptions:</p>
                                                <ul className="text-xs text-text-secondary space-y-1">
                                                    {message.assumptions.slice(0, 3).map((assumption, i) => (
                                                        <li key={i}>• {assumption}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-surface border border-border-light rounded-lg p-4">
                                <Loader2 className="w-5 h-5 animate-spin text-authority" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about a policy..."
                        className="input flex-1"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
