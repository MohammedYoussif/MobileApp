// src/types/auth.ts
import { User } from '@supabase/supabase-js';

/**
 * Category from categories table
 */
export interface Category {
    id: string;
    name: string;
    image_url: string | null;
    created_at: string;
}

// Base Auth User type from Supabase auth
export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
}

// User Profile from our Supabase profiles table
export interface UserProfile {
    id: string;
    fullName: string;
    dateOfBirth: string;
    email: string;
    city: string;
    whatsappBusiness: string;
    contactPerson: string;
    bio: string;
    companyName: string;
    profilePicture: string | null;
    coverPicture: string | null;
    category: string | null;
    categoryId: string | null;
    categoryName: string;
    categoryImageUrl: string | null;
    accountType: 'personal' | 'business';
    socialLinks: {
        instagram: string;
        twitter: string;
        whatsapp: string;
        [key: string]: string;
    };
    createdAt: string;
    updatedAt: string;
}

export type AccountType = 'personal' | 'business';


// Auth Context Interface
export interface AuthContextType {
    currentUser: AuthUser | null;
    userProfile: UserProfile | null;
    loading: boolean;
    profileLoading: boolean;
    error: string | null;
    authInitialized: boolean;
    resetParams: any;
    profileComplete: boolean;
    setResetParams: React.Dispatch<React.SetStateAction<any>>;
    login: (email: string, password: string) => Promise<any>;
    register: (email: string, password: string, displayName?: string) => Promise<any>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    googleSignIn: () => Promise<void>;
    appleSignIn: () => Promise<any>;
    revokeAppleSignIn: () => Promise<void>;
    updateUserProfile: (updates: { displayName?: string; photoURL?: string }) => Promise<void>;
    saveProfile: (profileData: Partial<UserProfile>) => Promise<void>;
    // New helper functions for categories
    getCategories: () => Category[];
    getCategoryById: (id: string) => Category | null;
    getCategoryNameById: (id: string) => string;
}

// Auth Provider Props
export interface AuthProviderProps {
    children: React.ReactNode;
}

/**
 * Auth error types to handle specific auth-related errors
 */
export type AuthErrorType =
    | 'invalid-email'
    | 'user-disabled'
    | 'user-not-found'
    | 'wrong-password'
    | 'email-already-in-use'
    | 'operation-not-allowed'
    | 'weak-password'
    | 'network-request-failed'
    | 'popup-closed-by-user'
    | 'auth-domain-config-required'
    | 'unauthorized'
    | 'user-cancelled'
    | 'requires-recent-login'
    | 'account-exists-with-different-credential'
    | 'invalid-credential'
    | 'provider-already-linked'
    | 'captcha-check-failed'
    | 'invalid-verification-code'
    | 'invalid-verification-id'
    | 'session-expired'
    | 'quota-exceeded'
    | 'invalid-action-code'
    | 'unknown';

/**
 * Auth error interface
 */
export interface AuthError {
    type: AuthErrorType;
    message: string;
    originalError?: unknown;
}

/**
 * Supabase specific auth session interface
 */
export interface SupabaseAuthSession {
    user: User | null;
    session: any | null; // Use actual Supabase Session type if needed
    error: Error | null;
}

/**
 * OAuth provider options
 */
export type OAuthProvider = 'google' | 'apple' | 'facebook' | 'twitter' | 'github';

/**
 * Social authentication config
 */
export interface SocialAuthConfig {
    provider: OAuthProvider;
    scopes?: string[];
    redirectTo?: string;
}

/**
 * User metadata that can be updated
 */
export interface UserMetadata {
    full_name?: string;
    avatar_url?: string;
    [key: string]: any; // For other custom metadata
}

// Re-export the Supabase User type for convenience
export type { User as SupabaseUser } from '@supabase/supabase-js';

