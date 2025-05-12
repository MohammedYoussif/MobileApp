// src/context/AuthContext.tsx
import { supabase } from "@/lib/supabase";
import { AuthContextType, AuthProviderProps, AuthUser } from "@/types";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google";
import { maybeCompleteAuthSession } from "expo-web-browser";
import React, { createContext, useContext, useEffect, useState } from "react";

// Complete the auth session for expo-auth-session
maybeCompleteAuthSession();

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);

  // Configure Google OAuth
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "",
    // webClientId: process.env.EXPO_PUBLIC_GID,
  });

  // Handle Google Sign-in
  useEffect(() => {
    if (response?.type === "success") {
      const { accessToken } = response.authentication || {};
      if (accessToken) {
        handleGoogleToken(accessToken);
      }
    }
  }, [response]);

  // Handle the Google token
  const handleGoogleToken = async (accessToken: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: accessToken,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Error with Google sign in:", error.message);
      setError(error.message);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        try {
          if (session?.user) {
            const formattedUser: AuthUser = {
              uid: session.user.id,
              email: session.user.email || null,
              displayName: session.user.user_metadata?.full_name || null,
              photoURL: session.user.user_metadata?.avatar_url || null,
              emailVerified: session.user.email_confirmed_at !== null,
            };
            setCurrentUser(formattedUser);
          } else {
            setCurrentUser(null);
          }
        } catch (err: any) {
          console.error("Auth state change error:", err);
          setError(err.message);
        } finally {
          setLoading(false);
          setAuthInitialized(true);
        }
      }
    );

    // Check initial session
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user) {
          const formattedUser: AuthUser = {
            uid: session.user.id,
            email: session.user.email || null,
            displayName: session.user.user_metadata?.full_name || null,
            photoURL: session.user.user_metadata?.avatar_url || null,
            emailVerified: session.user.email_confirmed_at !== null,
          };
          setCurrentUser(formattedUser);
        }
      } catch (err: any) {
        console.error("Session check error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    checkSession();

    return () => {
      if (authListener) authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data.user;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName,
          },
        },
      });

      if (error) throw error;
      return data.user;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const googleSignIn = async (): Promise<void> => {
    try {
      setError(null);
      await promptAsync();
    } catch (error: any) {
      setError(error.message || "Unknown error during Google Sign-In");
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  };

  const appleSignIn = async () => {
    try {
      setError(null);

      // Request Apple authentication
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        // Exchange the Apple token with Supabase
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "apple",
          token: credential.identityToken,
        });

        if (error) throw error;
        return data.user;
      } else {
        throw new Error("No identity token returned from Apple");
      }
    } catch (error: any) {
      if (error.code === "ERR_REQUEST_CANCELED") {
        // User cancelled Apple Sign-in
        return;
      }
      setError(error.message);
      throw error;
    }
  };

  const revokeAppleSignIn = async (): Promise<void> => {
    try {
      setError(null);
      // With Supabase, we can just sign out the user
      // Since Supabase doesn't have a direct method to revoke Apple tokens
      await logout();
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const updateUserProfile = async (updates: {
    displayName?: string;
    photoURL?: string;
  }): Promise<void> => {
    try {
      setError(null);

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: updates.displayName,
          avatar_url: updates.photoURL,
        },
      });

      if (error) throw error;

      // Update local state
      setCurrentUser((prevUser) =>
        prevUser
          ? {
              ...prevUser,
              displayName: updates.displayName || prevUser.displayName,
              photoURL: updates.photoURL || prevUser.photoURL,
            }
          : null
      );
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    error,
    authInitialized,
    login,
    register,
    logout,
    resetPassword,
    googleSignIn,
    appleSignIn,
    revokeAppleSignIn,
    updateUserProfile,
  };

  if (!authInitialized && loading) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
