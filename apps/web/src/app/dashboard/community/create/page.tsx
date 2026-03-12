'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePosts } from '@/hooks/usePosts';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CreatePostPage() {
    const router = useRouter();
    const { createPost } = usePosts();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        hubId: '',
        tags: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim()) return;

        setLoading(true);
        setError(null);

        try {
            await createPost({
                title: formData.title,
                content: formData.content,
                hubId: formData.hubId || 'general',
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            });
            router.push('/dashboard/community');
        } catch (err: any) {
            console.error('Failed to create post:', err);
            setError(err.message || 'Failed to create post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <Link
                href="/dashboard/community"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Community
            </Link>

            <div className="card-elevated">
                <h1 className="institutional-heading text-2xl mb-6">Start a Discussion in correct context</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="What's on your mind?"
                            className="input"
                            required
                            minLength={10}
                            maxLength={200}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Share your thoughts, questions, or analysis..."
                            className="input min-h-[200px] resize-y"
                            required
                            minLength={50}
                        />
                        <p className="text-xs text-gray-500 mt-1 text-right">
                            {formData.content.length} characters (min 50)
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Policy Domain (Hub)
                            </label>
                            <select
                                value={formData.hubId}
                                onChange={(e) => setFormData({ ...formData, hubId: e.target.value })}
                                className="input"
                            >
                                <option value="">Select a domain...</option>
                                <option value="income-tax">Income Tax</option>
                                <option value="gst">GST</option>
                                <option value="agriculture">Agriculture</option>
                                <option value="healthcare">Healthcare</option>
                                <option value="education">Education</option>
                                <option value="environment">Environment</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tags (comma separated)
                            </label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="policy, reform, opinion"
                                className="input"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-primary/10">
                        <Link href="/dashboard/community">
                            <button type="button" className="btn-secondary">
                                Cancel
                            </button>
                        </Link>
                        <button
                            type="submit"
                            disabled={loading || !formData.title.trim() || formData.content.length < 50}
                            className="btn-primary gap-2"
                        >
                            {loading ? (
                                'Publishing...'
                            ) : (
                                <>
                                    <Send className="w-4 h-4" /> Publish Post
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
