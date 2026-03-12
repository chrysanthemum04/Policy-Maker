export interface User {
    id: string;
    email: string;
    fullName: string;
    role: 'citizen' | 'expert' | 'government';
    avatar?: string;
    affiliation?: string;
    verified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    fullName: string;
    role: 'citizen' | 'expert' | 'government';
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken?: string;
}

export interface Simulation {
    id: string;
    userId: string;
    type: 'income-tax' | 'gst' | 'farm-subsidy';
    inputs: Record<string, any>;
    results: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

export interface Post {
    id: string;
    authorId: string;
    author: {
        name: string;
        avatar?: string;
        badge?: string;
        badgeColor?: string;
    };
    hubId: string;
    hubLabel: string;
    title: string;
    content: string;
    excerpt: string;
    upvotes: number;
    comments: number;
    tags: string[];
    isUpvoted: boolean;
    isBookmarked: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface APIError {
    message: string;
    code: string;
    statusCode: number;
}
