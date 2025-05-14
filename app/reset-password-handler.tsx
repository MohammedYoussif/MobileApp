import { ThemedText } from "@/components/ThemedText";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import Icon from "@expo/vector-icons/FontAwesome";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ResetPassword() {
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const localParams = useLocalSearchParams();
  const data = localParams?.["#"];

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Parse URL params
  const params = data
    ? new URLSearchParams(data as string)
    : new URLSearchParams();
  const json = Object.fromEntries(params.entries());

  const validatePasswords = () => {
    if (password.length < 6) {
      setError(t("resetPassword.passwordTooShort"));
      return false;
    }

    if (password !== confirmPassword) {
      setError(t("resetPassword.passwordMismatch"));
      return false;
    }

    setError("");
    return true;
  };

  const onResetPassword = async () => {
    if (!validatePasswords()) return;

    try {
      setIsLoading(true);
      setError("");

      // Set the session first
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: json.access_token,
        refresh_token: json.refresh_token,
      });

      if (sessionError) throw sessionError;

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;

      showMessage({
        message: t("resetPassword.created.title"),
        description: t("resetPassword.created.body"),
        type: "success",
        duration: 4000,
      });

      router.replace("/(auth)/signup");
    } catch (err) {
      console.error("Password reset error:", err);
      setError(
        typeof err === "object" && err !== null && "message" in err
          ? String(err.message)
          : t("resetPassword.generalError")
      );
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
      <TouchableOpacity onPress={router.back} style={styles.backButton}>
        <Icon name="chevron-left" size={24} color="#777" />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <ThemedText type="bold" style={styles.title}>
          {t("resetPassword.title")}
        </ThemedText>
        <ThemedText type="medium" style={styles.subtitle}>
          {t("resetPassword.chooseNewPassword")}
        </ThemedText>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={t("resetPassword.enterNewPassword")}
            value={password}
            onChangeText={(e) => {
              setPassword(e);
              setError("");
            }}
            secureTextEntry={!showPassword}
            placeholderTextColor="#999"
          />
          <Pressable
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={!showPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="#999"
            />
          </Pressable>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={t("resetPassword.confirmNewPassword")}
            value={confirmPassword}
            onChangeText={(e) => {
              setConfirmPassword(e);
              setError("");
            }}
            secureTextEntry={!showConfirmPassword}
            placeholderTextColor="#999"
          />
          <Pressable
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={!showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="#999"
            />
          </Pressable>
        </View>

        {error ? (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        ) : null}

        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              opacity:
                isLoading ||
                password.trim() === "" ||
                confirmPassword.trim() === "" ||
                error !== ""
                  ? 0.5
                  : 1,
            },
          ]}
          onPress={onResetPassword}
          disabled={
            isLoading ||
            password.trim() === "" ||
            confirmPassword.trim() === "" ||
            error !== ""
          }
        >
          <ThemedText type="bold" style={styles.submitButtonText}>
            {isLoading
              ? t("resetPassword.submiting")
              : t("resetPassword.submit")}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 24,
  },
  backButton: {
    marginBottom: 24,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    color: "#222",
  },
  subtitle: {
    fontSize: 16,
    color: "#222",
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Cairo-Regular",
  },
  submitButton: {
    width: "100%",
    height: 44,
    backgroundColor: "#B38051",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 12,
  },
});
