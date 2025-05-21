import BusinessStepOne from "@/components/profile/business/BusinessStepOne";
import BusinessStepThree from "@/components/profile/business/BusinessStepThree";
import BusinessStepTwo from "@/components/profile/business/BusinessStepTwo";
import PersonalStepOne from "@/components/profile/personal/PersonalStepOne";
import PersonalStepTwo from "@/components/profile/personal/PersonalStepTwo";
import { useAuth } from "@/context/auth.context";
import { AccountType, UserProfile } from "@/types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Loading Screen Component
const LoadingScreen = () => {
  return (
    <View style={[styles.container, styles.loading]}>
      <ActivityIndicator size="large" color="#B38051" />
    </View>
  );
};

const ProfileSetupFlow: React.FC = () => {
  const navigation = useRouter();
  const { top } = useSafeAreaInsets();
  const {
    userProfile,
    profileLoading,
    saveProfile,
    profileComplete,
    currentUser,
  } = useAuth();

  // console.log("The currentUser:", currentUser);
  console.log("The userProfile:", userProfile);

  const [accountType, setAccountType] = useState<AccountType>(
    (userProfile?.accountType as AccountType) || "personal"
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  // Redirect if profile is already complete
  useEffect(() => {
    if (profileComplete) {
      navigation.replace("/(app)/home");
    }
  }, [profileComplete, navigation]);

  useEffect(() => {
    if (userProfile)
      setFormData({
        ...userProfile,
        category: userProfile?.categoryId || formData.category,
        dateOfBirth: userProfile.dateOfBirth || undefined,
      });
  }, [userProfile]);

  // Handle loading state
  if (profileLoading) {
    return <LoadingScreen />;
  }

  const handleAccountTypeChange = (type: AccountType) => {
    setAccountType(type);
    // No need to reset step - allow switching between account types in step 1
    if (currentStep !== 1) {
      setCurrentStep(1);
    }

    // Update account type in form data
    setFormData({
      ...formData,
      accountType: type,
    });
  };

  const handleContinue = (stepData: Partial<UserProfile>) => {
    // Merge new data with existing form data
    const updatedFormData = {
      ...formData,
      ...stepData,
    };
    setFormData(updatedFormData);

    // Move to next step
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (accountType === "personal" && currentStep === 1) {
      // For personal accounts, go to step 2
      setCurrentStep(2);
    } else if (accountType === "personal" && currentStep === 2) {
      // For personal accounts, complete the setup when skipping step 2
      handleComplete();
    } else if (accountType === "business") {
      if (currentStep < 3) {
        // Move to next step when skipping in business flow
        setCurrentStep(currentStep + 1);
      } else {
        // Complete setup if on final step
        handleComplete();
      }
    }
  };

  const handleComplete = async () => {
    try {
      // Save all collected data to profile
      await saveProfile({
        ...formData,
        accountType,
      });

      // Navigate to main app once profile is complete
      navigation.replace("/(app)/home");
    } catch (error) {
      console.error("Error saving profile:", error);
      // Handle error (show alert, etc.)
    }
  };

  // Render current step based on account type and step number
  const renderStep = () => {
    // Use existing profile data to pre-fill forms

    if (accountType === "personal") {
      if (currentStep === 1) {
        return (
          <PersonalStepOne
            userData={userProfile as any}
            onContinue={handleContinue}
            onSkip={handleSkip}
            accountType={accountType}
            onAccountTypeChange={handleAccountTypeChange}
          />
        );
      } else if (currentStep === 2) {
        return (
          <PersonalStepTwo
            userData={userProfile as any}
            onBack={handleBack}
            onComplete={handleComplete}
            onSkip={handleSkip}
          />
        );
      }
    } else if (accountType === "business") {
      if (currentStep === 1) {
        return (
          <BusinessStepOne
            userData={userProfile as any}
            onContinue={handleContinue}
            onSkip={handleSkip}
            accountType={accountType}
            onAccountTypeChange={handleAccountTypeChange}
          />
        );
      } else if (currentStep === 2) {
        return (
          <BusinessStepTwo
            userData={userProfile as any}
            onContinue={handleContinue}
            onBack={handleBack}
            onSkip={handleSkip}
            socialLinks={formData?.socialLinks}
            setSocialLinks={(socialLinks: any) => {
              setFormData({
                ...formData,
                socialLinks: { ...socialLinks },
              });
            }}
          />
        );
      } else if (currentStep === 3) {
        return (
          <BusinessStepThree
            userData={userProfile as any}
            onBack={handleBack}
            onComplete={handleComplete}
            onSkip={handleSkip}
            formData={formData}
            setFormData={setFormData}
          />
        );
      }
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={[styles.container, { paddingTop: top }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {renderStep()}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-start",
  },
  loading: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileSetupFlow;
