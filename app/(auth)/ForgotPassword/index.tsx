import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/auth.context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { isValidEmail } from "@/utils/helpers";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";

export default function ForgotPassword() {
  const navigation = useRouter();
  const { resetPassword } = useAuth();
  const { top } = useSafeAreaInsets();
  const isDark = (useColorScheme() ?? "light") === "dark";
  const background = useThemeColor({}, "background");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setMessage("");
    setSubmitError("");
    if (!text) {
      setEmailError("Email requis.");
    } else if (!isValidEmail(text)) {
      setEmailError("Veuillez entrer une adresse email valide.");
    } else {
      setEmailError("");
    }
  };

  const handleReset = async () => {
    setMessage("");
    setSubmitError("");
    if (!email) {
      setEmailError("Email requis.");
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError("Veuillez entrer une adresse email valide.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage("Un email de réinitialisation a été envoyé.");
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        setSubmitError("Aucun utilisateur trouvé avec cet email.");
      } else if (error.code === "auth/invalid-email") {
        setSubmitError("Adresse email invalide.");
      } else {
        setSubmitError(
          "Erreur lors de la réinitialisation. Veuillez réessayer."
        );
      }
    }
    setLoading(false);
  };

  const canSubmit = !!email && !emailError && !loading;

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
        <View>
          <ThemedText style={styles.title}>Mot de passe oublié</ThemedText>
          <ThemedText style={styles.subtitle}>
            Entrez votre adresse email et nous vous enverrons un lien pour
            réinitialiser votre mot de passe.
          </ThemedText>

          <ThemedText style={styles.label}>Email</ThemedText>
          <TextInput
            style={[styles.input, { color: isDark ? "#fff" : "#000" }]}
            placeholder="name@example.com"
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

          <TouchableOpacity
            style={[styles.submitButton, { opacity: canSubmit ? 1 : 0.5 }]}
            onPress={handleReset}
            disabled={!canSubmit}
          >
            <ThemedText style={styles.submitButtonText}>
              {loading ? "Envoi..." : "Réinitialiser le mot de passe"}
            </ThemedText>
          </TouchableOpacity>
          {submitError ? (
            <ThemedText style={styles.errorText}>{submitError}</ThemedText>
          ) : null}
          {message ? (
            <ThemedText style={styles.successText}>{message}</ThemedText>
          ) : null}

          <TouchableOpacity
            style={{ marginTop: 24, alignSelf: "center" }}
            onPress={() => navigation.back()}
            disabled={loading}
          >
            <ThemedText style={styles.backLink}>
              Retour à la connexion
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
