// src/context/AuthContext.tsx
import { supabase } from "@/lib/supabase";
import { AuthContextType, AuthProviderProps, AuthUser } from "@/types";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);
  const [resetParams, setResetParams] = useState<any>();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "314892553525-jo89sobra69uisf0egi5q3mai0rcl30j.apps.googleusercontent.com",
      iosClientId:
        "314892553525-49lu03aeb8intjc7pq9fpjc414cgfvut.apps.googleusercontent.com",
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      profileImageSize: 120,
    });
  }, []);

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
          emailRedirectTo: "https://dashboard.bexpo.xyz/",
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
      await GoogleSignin.signOut();
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
        redirectTo: "https://dashboard.bexpo.xyz/reset-password-handler",
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

      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();

      if (userInfo.data?.idToken) {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: userInfo.data.idToken,
        });

        if (error) throw error;
      } else {
        throw new Error("No ID token returned from Google Sign-In");
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("Sign in cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Sign in already in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play services not available");
        setError("Google Play Services not available");
      } else {
        setError(error.message || "Unknown error during Google Sign-In");
        console.error("Google Sign-In Error:", error);
        throw error;
      }
    }
  };

  const appleSignIn = async () => {
    try {
      setError(null);

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
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
        return;
      }
      setError(error.message);
      throw error;
    }
  };

  const revokeAppleSignIn = async (): Promise<void> => {
    try {
      setError(null);
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
    resetParams,
    setResetParams,
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
