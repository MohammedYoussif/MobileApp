import LanguageSelect from "@/components/LanguageSwitcher";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/auth.context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { isValidEmail } from "@/utils/helpers";
import Icon from "@expo/vector-icons/FontAwesome";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
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
  const LOGO = require("@/assets/images/logo.png");
  // Validate email on change
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
      // Make sure your login function accepts email and password
      await login(email, password);
      // On success, you can navigate or do something else
    } catch (error: any) {
      // Adjust error handling as per your backend
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
      style={{ flex: 1, backgroundColor: background, paddingTop: top }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={{ alignItems: "center" }}>
          <Image
            source={LOGO}
            style={{ width: 120, height: 120 }}
            resizeMode="contain"
            accessibilityLabel={t("accessibility.appLogo")}
          />
        </ThemedView>

        <ThemedView style={{ flex: 1 }}>
          <ThemedText style={styles.label}>{t("email")}</ThemedText>
          <TextInput
            style={styles.input}
            placeholder={t("placeholders.email")}
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

          <ThemedView style={styles.passwordRow}>
            <ThemedText style={styles.label}>{t("password")}</ThemedText>
            <TouchableOpacity
              onPress={() => navigation.push("/(auth)/ForgotPassword")}
            >
              <ThemedText style={styles.forgot}>
                {t("forgotPassword")}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
          <TextInput
            style={styles.input}
            placeholder={t("placeholders.password")}
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            placeholderTextColor="#aaa"
            editable={!loading}
          />
          {passwordError ? (
            <ThemedText style={styles.errorText}>{passwordError}</ThemedText>
          ) : null}

          <TouchableOpacity
            style={[styles.loginButton, { opacity: canLogin ? 1 : 0.5 }]}
            onPress={handleLogin}
            disabled={!canLogin}
          >
            <ThemedText style={styles.loginButtonText}>
              {loading ? t("buttons.loggingIn") : t("buttons.login")}
            </ThemedText>
          </TouchableOpacity>
          {loginError ? (
            <ThemedText style={styles.errorText}>{loginError}</ThemedText>
          ) : null}

          <ThemedView style={styles.dividerRow}>
            <ThemedView style={styles.divider} />
            <ThemedText style={styles.orText}>{t("continueWith")}</ThemedText>
            <ThemedView style={styles.divider} />
          </ThemedView>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => googleSignIn()}
            disabled={loading}
          >
            <Icon
              name="google"
              size={20}
              color="#000"
              style={styles.socialIcon}
            />
            <ThemedText style={styles.socialText}>
              {t("buttons.continueWithGoogle")}
            </ThemedText>
          </TouchableOpacity>

          {appleAuth.isSupported && (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => appleSignIn()}
              disabled={loading}
            >
              <Icon
                name="apple"
                size={20}
                color="#000"
                style={styles.socialIcon}
              />
              <ThemedText style={styles.socialText}>
                {t("buttons.continueWithApple")}
              </ThemedText>
            </TouchableOpacity>
          )}

          <ThemedView style={styles.signupRow}>
            <ThemedText style={styles.signupText}>{t("noAccount")} </ThemedText>
            <TouchableOpacity onPress={() => navigation.push("/(auth)/signup")}>
              <ThemedText style={styles.signupLink}>
                {t("buttons.signup")}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
        <LanguageSelect />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
