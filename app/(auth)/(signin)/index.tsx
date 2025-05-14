import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/auth.context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { isValidEmail } from "@/utils/helpers";
import Icon from "@expo/vector-icons/FontAwesome";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";

export default function Signin() {
  const { t } = useTranslation();
  const navigation = useRouter();
  const { googleSignIn, appleSignIn, login } = useAuth();
  const { top } = useSafeAreaInsets();
  const background = useThemeColor({}, "background");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const LOGO = require("@/assets/images/icon.png");

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

  // Validate password on change
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (!text) {
      setPasswordError(t("errors.passwordRequired"));
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async () => {
    setLoginError("");
    // Final check before attempting login
    if (!email) {
      setEmailError(t("errors.emailRequired"));
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError(t("errors.invalidEmail"));
      return;
    }
    if (!password) {
      setPasswordError(t("errors.passwordRequired"));
      return;
    }
    if (emailError || passwordError) return;

    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        setLoginError(t("errors.userNotFound"));
      } else if (error.code === "auth/wrong-password") {
        setLoginError(t("errors.wrongPassword"));
      } else if (error.code === "auth/invalid-email") {
        setLoginError(t("errors.invalidEmail"));
      } else {
        setLoginError(t("errors.loginFailed"));
      }
    }
    setLoading(false);
  };

  const canLogin =
    !!email && !!password && !emailError && !passwordError && !loading;

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: background, paddingTop: top },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image
            alt="logo"
            source={LOGO}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <ThemedText type="bold" style={styles.title}>
            {t("signin.title")}
          </ThemedText>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={t("email") || "Email"}
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#aaa"
              editable={!loading}
            />
            {emailError ? (
              <ThemedText style={styles.errorText}>{emailError}</ThemedText>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder={t("password") || "Password"}
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                placeholderTextColor="#aaa"
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Icon
                  name={!showPassword ? "eye-slash" : "eye"}
                  size={20}
                  color="#aaa"
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <ThemedText style={styles.errorText}>{passwordError}</ThemedText>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.forgotContainer}
            onPress={() => navigation.push("/(auth)/ForgotPassword")}
          >
            <ThemedText style={styles.forgotText}>
              {t("forgotPassword.title") || "Forgot Password"} ?
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.signInButton, { opacity: canLogin ? 1 : 0.5 }]}
            onPress={handleLogin}
            disabled={!canLogin}
          >
            <ThemedText type="bold" style={styles.signInButtonText}>
              {loading
                ? t("buttons.loggingIn")
                : t("buttons.login") || "Sign In"}
            </ThemedText>
          </TouchableOpacity>

          {loginError ? (
            <ThemedText style={styles.errorText}>{loginError}</ThemedText>
          ) : null}

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <ThemedText style={styles.dividerText}>
              {t("continueWith") || "OR"}
            </ThemedText>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={googleSignIn}
              disabled={loading}
            >
              <Icon name="google" size={24} />
            </TouchableOpacity>

            {appleAuth.isSupported && (
              <TouchableOpacity
                style={styles.socialButton}
                onPress={appleSignIn}
                disabled={loading}
              >
                <Icon name="apple" size={24} color="#000" />
              </TouchableOpacity>
            )}
          </View>

          <ThemedText style={styles.termsText}>
            <Trans
              i18nKey="agreement"
              components={{
                terms: <ThemedText type="bold" />,
                privacy: <ThemedText type="bold" />,
              }}
            />
          </ThemedText>

          <View style={styles.signupContainer}>
            <ThemedText style={styles.signupText}>{t("noAccount")} </ThemedText>
            <TouchableOpacity onPress={() => navigation.push("/(auth)/signup")}>
              <ThemedText type="bold" style={styles.signupLink}>
                {t("buttons.signup") || "Sign Up"}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
