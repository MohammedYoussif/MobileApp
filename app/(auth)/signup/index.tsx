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

export default function SignUp() {
  const { t } = useTranslation();
  const navigation = useRouter();
  const { googleSignIn, appleSignIn, register } = useAuth();
  const { top } = useSafeAreaInsets();
  const background = useThemeColor({}, "background");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullnameError, setFullnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const LOGO = require("@/assets/images/icon.png");

  const handleFullnameChange = (text: string) => {
    setFullname(text);
    if (!text) {
      setFullnameError(t("errors.fullnameRequired"));
    } else if (text.trim().length < 2) {
      setFullnameError(t("errors.fullnameTooShort"));
    } else {
      setFullnameError("");
    }
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

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (!text) {
      setPasswordError(t("errors.passwordRequired"));
    } else {
      setPasswordError("");
    }
  };

  const handleSignUp = async () => {
    setLoginError("");
    if (!fullname) {
      setFullnameError(t("errors.fullnameRequired"));
      return;
    }
    if (fullname.trim().length < 2) {
      setFullnameError(t("errors.fullnameTooShort"));
      return;
    }
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
    if (fullnameError || emailError || passwordError) return;

    setLoading(true);
    try {
      await register(email, password, fullname);
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setLoginError(t("errors.emailInUse"));
      } else if (error.code === "auth/invalid-email") {
        setLoginError(t("errors.invalidEmail"));
      } else if (error.code === "auth/weak-password") {
        setLoginError(t("errors.weakPassword"));
      } else {
        setLoginError(t("errors.signupFailed"));
      }
    }
    setLoading(false);
  };

  const canSignUp =
    !!fullname &&
    !!email &&
    !!password &&
    !fullnameError &&
    !emailError &&
    !passwordError &&
    !loading;

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
          <Image alt="logo" source={LOGO} style={styles.logo} />
        </View>

        <View style={styles.formContainer}>
          <ThemedText type="bold" style={styles.title}>
            {t("signupTitle")}
          </ThemedText>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={t("fullname") || "Full Name"}
              value={fullname}
              onChangeText={handleFullnameChange}
              autoCapitalize="words"
              placeholderTextColor="#aaa"
              editable={!loading}
            />
            {fullnameError ? (
              <ThemedText style={styles.errorText}>{fullnameError}</ThemedText>
            ) : null}
          </View>

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
            style={[styles.signInButton, { opacity: canSignUp ? 1 : 0.5 }]}
            onPress={handleSignUp}
            disabled={!canSignUp}
          >
            <ThemedText type="bold" style={styles.signInButtonText}>
              {loading
                ? t("buttons.suginingUp")
                : t("buttons.signup") || "Sign Up"}
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
            <ThemedText style={styles.signupText}>
              {t("haveAccount")}{" "}
            </ThemedText>
            <TouchableOpacity onPress={navigation.back}>
              <ThemedText type="bold" style={styles.signupLink}>
                {t("buttons.login") || "Sign In"}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
