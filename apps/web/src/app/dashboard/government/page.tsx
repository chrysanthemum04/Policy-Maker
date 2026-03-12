/**
 * Government Dashboard
 * Structured simulation interface for policy analysis
 */

'use client';

import { useState, useEffect } from 'react';
import { FileText, TrendingUp, Users, AlertCircle } from 'lucide-react';

export default function GovernmentDashboard() {
    const [selectedDomainId, setSelectedDomainId] = useState('');
    const [scenario, setScenario] = useState('');
    const [parameters, setParameters] = useState({
        timeframe: '1-year',
        scope: 'national',
        budget: '',
    });
    const [domains, setDomains] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    // Fetch domains on mount
    useEffect(() => {
        fetch('/api/policy-domains')
            .then(res => res.json())
            .then(data => setDomains(data.domains || []))
            .catch(err => console.error('Failed to load domains', err));
    }, []);

    const handleSimulate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Authentication required');

            const response = await fetch('/api/simulations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    mode: 'simulation',
                    policyDomainId: selectedDomainId,
                    userInput: scenario,
                    parameters: parameters
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Simulation failed');

            setResult(data.output);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to run simulation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="institutional-heading text-4xl mb-2">
                    Government Dashboard
                </h1>
                <p className="text-text-secondary">
                    Analyze policy impacts with structured simulations
                </p>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="card">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-authority" />
                        <h3 className="font-semibold">Simulations Run</h3>
                    </div>
                    <p className="text-3xl font-bold text-text-primary">24</p>
                    <p className="text-sm text-text-muted">This month</p>
                </div>

                <div className="card">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-success" />
                        <h3 className="font-semibold">Active Policies</h3>
                    </div>
                    <p className="text-3xl font-bold text-text-primary">8</p>
                    <p className="text-sm text-text-muted">Under analysis</p>
                </div>

                <div className="card">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-info" />
                        <h3 className="font-semibold">Impact Reach</h3>
                    </div>
                    <p className="text-3xl font-bold text-text-primary">2.4M</p>
                    <p className="text-sm text-text-muted">Estimated citizens</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Simulation Form */}
                <div className="card-elevated h-fit">
                    <h2 className="institutional-heading text-2xl mb-6">
                        New Policy Simulation
                    </h2>

                    <div className="bg-surface border-l-4 border-warning p-4 rounded-md mb-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-text-secondary">
                                    <strong>Disclaimer:</strong> AI outputs are directional estimates.
                                    They do not predict exact outcomes.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSimulate} className="space-y-6">
                        {/* Policy Domain */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Policy Domain *
                            </label>
                            <select
                                value={selectedDomainId}
                                onChange={(e) => setSelectedDomainId(e.target.value)}
                                className="input"
                                required
                            >
                                <option value="">Select a domain</option>
                                {domains.map((domain) => (
                                    <option key={domain.id} value={domain.id}>
                                        {domain.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Scenario Description */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Policy Scenario *
                            </label>
                            <textarea
                                value={scenario}
                                onChange={(e) => setScenario(e.target.value)}
                                placeholder="Describe the policy change..."
                                className="input min-h-[120px]"
                                required
                            />
                        </div>

                        {/* Parameters (Buckets) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    Timeframe
                                </label>
                                <select
                                    value={parameters.timeframe}
                                    onChange={(e) => setParameters({ ...parameters, timeframe: e.target.value })}
                                    className="input"
                                >
                                    <option value="6-months">6 Months</option>
                                    <option value="1-year">1 Year</option>
                                    <option value="3-years">3 Years</option>
                                    <option value="5-years">5 Years</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    Scope
                                </label>
                                <select
                                    value={parameters.scope}
                                    onChange={(e) => setParameters({ ...parameters, scope: e.target.value })}
                                    className="input"
                                >
                                    <option value="national">National</option>
                                    <option value="state">State</option>
                                    <option value="local">Local</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    Budget Allocation
                                </label>
                                <input
                                    type="text"
                                    value={parameters.budget}
                                    onChange={(e) => setParameters({ ...parameters, budget: e.target.value })}
                                    placeholder="e.g., ₹1000 Cr"
                                    className="input"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm p-3 bg-red-50 rounded">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="submit"
                                className="btn-primary w-full md:w-auto"
                                disabled={loading}
                            >
                                {loading ? 'Running Simulation...' : 'Run Simulation'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {result ? (
                        <div className="card-elevated border-l-4 border-authority">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="institutional-heading text-2xl">Analysis Results</h2>
                                <span className={`badge badge-${result.confidenceLevel || 'medium'}`}>
                                    Confidence: {(result.confidenceLevel || 'medium').toUpperCase()}
                                </span>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-text-primary mb-2">Key Impacts</h3>
                                    <ul className="space-y-2">
                                        {result.briefSummary?.keyImpacts?.map((impact: string, i: number) => (
                                            <li key={i} className="flex gap-2 text-text-secondary text-sm">
                                                <span className="text-authority">•</span>
                                                {impact}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-surface rounded-lg">
                                        <h4 className="font-semibold text-text-primary mb-2">Trade-offs</h4>
                                        <ul className="text-sm text-text-secondary space-y-1">
                                            {result.detailedAnalysis?.tradeOffs?.map((item: string, i: number) => (
                                                <li key={i}>• {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="p-4 bg-red-50/50 rounded-lg">
                                        <h4 className="font-semibold text-red-700 mb-2">Risk Zones</h4>
                                        <ul className="text-sm text-red-600 space-y-1">
                                            {result.detailedAnalysis?.riskZones?.map((item: string, i: number) => (
                                                <li key={i}>• {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-text-primary mb-2">Detailed Reasoning</h3>
                                    <p className="text-sm text-text-secondary whitespace-pre-wrap">
                                        {typeof result.extendedReport?.expandedReasoning === 'string'
                                            ? result.extendedReport.expandedReasoning
                                            : JSON.stringify(result.extendedReport?.expandedReasoning || "Analysis complete.")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="card h-full flex items-center justify-center text-center p-12 text-text-muted">
                            <div>
                                <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-medium">Ready to Simulate</p>
                                <p className="text-sm">Enter policy details to generate analysis</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
