// src/context/AuthContext.tsx
import { supabase } from "@/lib/supabase";
import {
  AuthContextType,
  AuthProviderProps,
  AuthUser,
  UserProfile,
} from "@/types";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);
  const [resetParams, setResetParams] = useState<any>();
  const [profileComplete, setProfileComplete] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);

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

  // Fetch categories once on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name");

        if (error) {
          console.error("Error fetching categories:", error);
        } else if (data) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Categories fetch error:", err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch user profile from Supabase when user is authenticated
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) {
        setUserProfile(null);
        setProfileComplete(false);
        return;
      }

      try {
        setProfileLoading(true);
        // Use the user_profiles view to get combined data
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", currentUser.uid)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          setUserProfile(null);
          setProfileComplete(false);
        } else if (data) {
          const profile: UserProfile = {
            id: data.id,
            fullName: data.full_name || "",
            dateOfBirth: data.date_of_birth || "",
            email: data.email || currentUser.email || "",
            city: data.city || "",
            whatsappBusiness: data.whatsapp_business || "",
            contactPerson: data.contact_person || "",
            bio: data.bio || "",
            companyName: data.company_name || "",
            profilePicture: data.profile_picture || null,
            coverPicture: data.cover_picture || null,
            categoryId: data.category_id || null,
            categoryName: data.category_name || "",
            categoryImageUrl: data.category_image_url || null,
            accountType: data.account_type || "personal",
            socialLinks: data.social_links || {
              instagram: "",
              twitter: "",
              whatsapp: "",
            },
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };

          setUserProfile(profile);

          setProfileComplete(data.is_completed);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

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

  // New function to save the complete profile
  const saveProfile = async (
    profileData: Partial<UserProfile>
  ): Promise<void> => {
    if (!currentUser) {
      throw new Error("No authenticated user found");
    }

    try {
      setError(null);
      setProfileLoading(true);

      // Format the profile data for Supabase
      const formattedData = {
        id: currentUser.uid,
        full_name: profileData.fullName,
        date_of_birth: profileData.dateOfBirth,
        email: profileData.email || currentUser.email,
        city: profileData.city,
        whatsapp_business: profileData.whatsappBusiness,
        contact_person: profileData.contactPerson,
        bio: profileData.bio,
        company_name: profileData.companyName,
        profile_picture: profileData.profilePicture,
        cover_picture: profileData.coverPicture,
        category_id: profileData.categoryId,
        account_type: profileData.accountType || "personal",
        social_links: profileData.socialLinks,
        updated_at: new Date().toISOString(),
      };

      // Upload profile picture if it's a local file URI
      if (
        profileData.profilePicture &&
        profileData.profilePicture.startsWith("file://")
      ) {
        const filePath = `profiles/${currentUser.uid}/profile-${Date.now()}`;
        await uploadImage(
          profileData.profilePicture,
          filePath,
          "profile_picture",
          formattedData
        );
      }

      // Upload cover picture if it's a local file URI
      if (
        profileData.coverPicture &&
        profileData.coverPicture.startsWith("file://")
      ) {
        const filePath = `profiles/${currentUser.uid}/cover-${Date.now()}`;
        await uploadImage(
          profileData.coverPicture,
          filePath,
          "cover_picture",
          formattedData
        );
      }

      // Save to profiles table
      const { error } = await supabase
        .from("profiles")
        .upsert(formattedData)
        .select();

      if (error) throw error;

      // Fetch the category information for the updated profile
      let categoryName = "";
      let categoryImageUrl = null;

      if (formattedData.category_id) {
        const { data: categoryData } = await supabase
          .from("categories")
          .select("name, image_url")
          .eq("id", formattedData.category_id)
          .single();

        if (categoryData) {
          categoryName = categoryData.name;
          categoryImageUrl = categoryData.image_url;
        }
      }

      // Update the user profile state
      setUserProfile(
        (prevProfile) =>
          ({
            ...prevProfile,
            ...profileData,
            id: currentUser.uid,
            updatedAt: new Date().toISOString(),
            categoryName: categoryName,
            categoryImageUrl: categoryImageUrl,
          } as UserProfile)
      );

      // Update profile completion status
      const isComplete =
        profileData.accountType === "personal"
          ? !!(
              profileData.fullName ||
              ((prevProfile: any) => prevProfile?.fullName)
            )
          : !!(
              profileData.companyName ||
              ((prevProfile: any) => prevProfile?.companyName)
            );

      setProfileComplete(isComplete);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      setError(error.message);
      throw error;
    } finally {
      setProfileLoading(false);
    }
  };

  // Helper function to upload images to Supabase Storage
  const uploadImage = async (
    fileUri: string,
    path: string,
    fieldName: string,
    formattedData: any
  ) => {
    try {
      // Fetch the file
      const response = await fetch(fileUri);
      const blob = await response.blob();

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("user-uploads")
        .upload(path, blob, {
          contentType: "image/jpeg", // Adjust based on your image type
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("user-uploads")
        .getPublicUrl(path);

      // Update the field in the formatted data
      formattedData[fieldName] = publicUrlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  // Get all available categories
  const getCategories = () => {
    return categories;
  };

  // Get category by ID
  const getCategoryById = (id: string) => {
    return categories.find((cat) => cat.id === id) || null;
  };

  // Get category name by ID
  const getCategoryNameById = (id: string) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : "";
  };

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    profileLoading,
    error,
    authInitialized,
    resetParams,
    profileComplete,
    setResetParams,
    login,
    register,
    logout,
    resetPassword,
    googleSignIn,
    appleSignIn,
    revokeAppleSignIn,
    updateUserProfile,
    saveProfile,
    getCategories,
    getCategoryById,
    getCategoryNameById,
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
