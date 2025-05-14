// src/types/auth.ts
import { User } from '@supabase/supabase-js';

/**
 * Represents the authenticated user in the application
 */
export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
}

/**
 * Props for the AuthProvider component
 */
export interface AuthProviderProps {
    children: React.ReactNode;
}

/**
 * The auth context type definition
 */
export interface AuthContextType {
    currentUser: AuthUser | null;
    loading: boolean;
    error: string | null;
    authInitialized: boolean;
    resetParams: any;

    // Core auth methods
    login: (email: string, password: string) => Promise<User | null>;
    register: (email: string, password: string, displayName?: string) => Promise<User | null>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    setResetParams: (params: any) => void;

    // Social auth methods
    googleSignIn: () => Promise<void>;
    appleSignIn: () => Promise<User | null | undefined>;
    revokeAppleSignIn: () => Promise<void>;

    // Profile management
    updateUserProfile: (updates: {
        displayName?: string;
        photoURL?: string;
    }) => Promise<void>;
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
