import { apiClient } from '@/lib/api';
import { Post } from '@/types';
import { useState, useEffect } from 'react';

export function usePosts(filter: 'trending' | 'new' | 'following' = 'trending', hubId?: string) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, [filter, hubId]);

    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams({ filter });
            if (hubId) params.append('hubId', hubId);

            const response = await apiClient.get<{ posts: Post[] }>(`/posts?${params}`);
            setPosts(response.posts);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch posts');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleUpvote = async (postId: string) => {
        try {
            const response = await apiClient.post<{ upvoted: boolean }>(`/posts/${postId}/upvote`);
            setPosts(posts.map(p =>
                p.id === postId
                    ? { ...p, isUpvoted: response.upvoted, upvotes: p.upvotes + (response.upvoted ? 1 : -1) }
                    : p
            ));
        } catch (err) {
            console.error('Failed to toggle upvote:', err);
        }
    };

    const toggleBookmark = async (postId: string) => {
        try {
            const response = await apiClient.post<{ bookmarked: boolean }>(`/posts/${postId}/bookmark`);
            setPosts(posts.map(p =>
                p.id === postId
                    ? { ...p, isBookmarked: response.bookmarked }
                    : p
            ));
        } catch (err) {
            console.error('Failed to toggle bookmark:', err);
        }
    };

    const createPost = async (data: { title: string; content: string; hubId: string; tags?: string[] }) => {
        try {
            const newPost = await apiClient.post<Post>('/posts', data);
            setPosts([newPost, ...posts]);
            return newPost;
        } catch (err: any) {
            throw new Error(err.message || 'Failed to create post');
        }
    };

    return {
        posts,
        isLoading,
        error,
        toggleUpvote,
        toggleBookmark,
        createPost,
        refetch: fetchPosts,
    };
}

export function usePost(postId: string) {
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const fetchPost = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.get<Post>(`/posts/${postId}`);
            setPost(response);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch post');
        } finally {
            setIsLoading(false);
        }
    };

    const addComment = async (content: string) => {
        try {
            const comment = await apiClient.post(`/posts/${postId}/comments`, { content });
            if (post) {
                setPost({
                    ...post,
                    comments: post.comments ? [comment, ...post.comments] : [comment],
                });
            }
            return comment;
        } catch (err: any) {
            throw new Error(err.message || 'Failed to add comment');
        }
    };

    return {
        post,
        isLoading,
        error,
        addComment,
        refetch: fetchPost,
    };
}
