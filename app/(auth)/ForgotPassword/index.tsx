import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/auth.context";
import { isValidEmail } from "@/utils/helpers";
import Icon from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, TextInput, TouchableOpacity, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (!text) {
      setEmailError(t("errors.emailRequired"));
    } else if (!isValidEmail(text)) {
      setEmailError(t("errors.invalidEmail"));
    } else {
      setEmailError("");
    }
  };

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      await resetPassword(email);
      handleBackPress();
      showMessage({
        message: t("forgotPassword.created.title"),
        description: t("forgotPassword.created.body"),
        type: "success",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: top + (StatusBar.currentHeight ?? 0) },
      ]}
    >
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Icon name="chevron-left" size={24} color="#777" />
      </TouchableOpacity>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        <ThemedText type="bold" style={styles.title}>
          {t("forgotPassword.title")}
        </ThemedText>
        <ThemedText type="medium" style={styles.subtitle}>
          {t("forgotPassword.subtitle")}
        </ThemedText>

        {/* Input Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={t("email") || "Email"}
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#aaa"
            editable={!isLoading}
          />
          {emailError ? (
            <ThemedText style={styles.errorText}>{emailError}</ThemedText>
          ) : null}
        </View>

        {/* Send OTP Button */}
        <TouchableOpacity
          style={[
            styles.otpButton,
            {
              opacity:
                isLoading || email.trim() === "" || emailError !== "" ? 0.5 : 1,
            },
          ]}
          disabled={isLoading || email.trim() === "" || emailError !== ""}
          onPress={handleResetPassword}
        >
          <ThemedText type="bold" style={styles.otpButtonText}>
            {isLoading
              ? t("forgotPassword.sending")
              : t("forgotPassword.sendOtp")}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
