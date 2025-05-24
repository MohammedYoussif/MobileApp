import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/types";

export const saveProfileData = async (
  userData: Partial<UserProfile>,
  accountType: string
) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      throw new Error("No authenticated user found");
    }

    const userId = session.user.id;

    // Map user data to database structure
    const profileData = {
      id: userId,
      full_name: userData.fullName,
      date_of_birth: userData.dateOfBirth,
      email: userData.email,
      city: userData.city,
      whatsapp_business: userData.whatsappBusiness,
      contact_person: userData.contactPerson,
      bio: userData.bio,
      company_name: userData.companyName,
      profile_picture: userData.profilePicture,
      cover_picture: userData.coverPicture,
      category: userData.category,
      social_links: userData.socialLinks,
      account_type: accountType,
      updated_at: new Date(),
      is_created: true,
    };

    // Process image uploads
    if (userData.profilePicture) {
      const profilePicture = await processImage(
        userData.profilePicture,
        `profiles/profile-${userId}-${Date.now()}`
      );
      if (profilePicture) {
        profileData.profile_picture = profilePicture;
      }
    }

    if (userData.coverPicture) {
      const coverPicture = await processImage(
        userData.coverPicture,
        `covers/cover-${userId}-${Date.now()}`
      );
      if (coverPicture) {
        profileData.cover_picture = coverPicture;
      }
    }

    // Save to profiles table
    const { data, error } = await supabase
      .from("profiles")
      .upsert(profileData)
      .select();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error saving profile:", error);
    return { success: false, error: error.message };
  }
};

// Helper function to process images for upload
const processImage = async (
  fileUri: string,
  path: string
): Promise<string | null> => {
  // Only process if it's a local file
  if (!fileUri.startsWith("file://")) return fileUri;

  try {
    // Make sure the fileUri is valid
    if (!fileUri) {
      console.error("Invalid file URI");
      return null;
    }

    // Fetch the file with proper error handling
    const response = await fetch(fileUri);

    // Check if the fetch was successful
    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }

    // Get the blob
    const blob = await response.blob();

    // Verify we have valid content
    if (blob.size === 0) {
      throw new Error("Empty blob retrieved");
    }

    // Get the correct content type from the blob or use default
    const contentType = blob.type || "image/jpeg";
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("profile-images")
      .upload(path, blob, {
        contentType: contentType,
        upsert: true,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw error;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("profile-images")
      .getPublicUrl(path);

    // Verify we got a valid URL back
    if (!publicUrlData?.publicUrl) {
      throw new Error("Failed to get valid public URL");
    }

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error(
      "Error processing image:",
      error,
      typeof error === "object" ? JSON.stringify(error) : ""
    );
    return null;
  }
};

export default {
  saveProfileData,
};
