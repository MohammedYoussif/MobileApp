import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/auth.context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { isValidEmail } from "@/utils/helpers";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";

export default function Signup() {
  const navigation = useRouter();
  const { register, login } = useAuth();
  const { top } = useSafeAreaInsets();
  const isDark = (useColorScheme() ?? "light") === "dark";
  const background = useThemeColor({}, "background");

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Error states
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const LOGO = isDark
    ? require("@/assets/images/logo-dark.png")
    : require("@/assets/images/logo.png");

  // Validation handlers
  const handleFirstNameChange = (text: string) => {
    setFirstName(text);
    setFirstNameError(text.trim() ? "" : "Prénom requis.");
  };

  const handleLastNameChange = (text: string) => {
    setLastName(text);
    setLastNameError(text.trim() ? "" : "Nom de famille requis.");
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (!text) setEmailError("Email requis.");
    else if (!isValidEmail(text))
      setEmailError("Veuillez entrer une adresse email valide.");
    else setEmailError("");
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (!text) setPasswordError("Mot de passe requis.");
    else if (text.length < 6)
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères.");
    else setPasswordError("");
  };

  const handleTermsToggle = () => {
    setAcceptedTerms((prev) => !prev);
    setTermsError("");
  };

  const validateAll = () => {
    handleFirstNameChange(firstName);
    handleLastNameChange(lastName);
    handleEmailChange(email);
    handlePasswordChange(password);
    if (!acceptedTerms)
      setTermsError("Vous devez accepter les termes et conditions.");
    else setTermsError("");
  };

  const canRegister =
    firstName.trim() &&
    lastName.trim() &&
    email &&
    isValidEmail(email) &&
    password &&
    password.length >= 6 &&
    acceptedTerms &&
    !firstNameError &&
    !lastNameError &&
    !emailError &&
    !passwordError &&
    !termsError &&
    !loading;

  const handleRegister = async () => {
    setSubmitError("");
    validateAll();
    if (!canRegister) return;
    setLoading(true);
    try {
      await register(email, password, `${firstName.trim()} ${lastName.trim()}`);
      showMessage({
        message: "Succès",
        description: "Votre compte a été créé !",
        statusBarHeight: StatusBar.currentHeight,
        type: "success",
      });
      await login(email, password);
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setSubmitError("Cet email est déjà utilisé.");
      } else if (error.code === "auth/invalid-email") {
        setSubmitError("Adresse email invalide.");
      } else {
        setSubmitError("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    }
    setLoading(false);
  };

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
            accessibilityLabel="App Logo"
          />
        </ThemedView>

        <ThemedView style={{ flex: 1 }}>
          <ThemedText style={styles.label}>Prénom</ThemedText>
          <TextInput
            style={[styles.input, { color: isDark ? "#fff" : "#000" }]}
            placeholder="Prénom"
            value={firstName}
            onChangeText={handleFirstNameChange}
            autoCapitalize="words"
            placeholderTextColor="#aaa"
            editable={!loading}
          />
          {firstNameError ? (
            <ThemedText style={styles.errorText}>{firstNameError}</ThemedText>
          ) : null}

          <ThemedText style={styles.label}>Nom de famille</ThemedText>
          <TextInput
            style={[styles.input, { color: isDark ? "#fff" : "#000" }]}
            placeholder="Nom de famille"
            value={lastName}
            onChangeText={handleLastNameChange}
            autoCapitalize="words"
            placeholderTextColor="#aaa"
            editable={!loading}
          />
          {lastNameError ? (
            <ThemedText style={styles.errorText}>{lastNameError}</ThemedText>
          ) : null}

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

          <ThemedText style={styles.label}>Mot de passe</ThemedText>
          <TextInput
            style={[styles.input, { color: isDark ? "#fff" : "#000" }]}
            placeholder="••••••••"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            placeholderTextColor="#aaa"
            editable={!loading}
          />
          {passwordError ? (
            <ThemedText style={styles.errorText}>{passwordError}</ThemedText>
          ) : null}

          {/* Terms and Conditions Checkbox */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={handleTermsToggle}
            disabled={loading}
            activeOpacity={0.7}
          >
            <View
              style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}
            >
              {acceptedTerms ? <View style={styles.checkboxInner} /> : null}
            </View>
            <ThemedText style={styles.termsText}>
              Vous devez accepter les termes et conditions
            </ThemedText>
          </TouchableOpacity>
          {termsError ? (
            <ThemedText style={styles.errorText}>{termsError}</ThemedText>
          ) : null}

          <TouchableOpacity
            style={[styles.loginButton, { opacity: canRegister ? 1 : 0.5 }]}
            onPress={handleRegister}
            disabled={!canRegister}
          >
            <ThemedText style={styles.loginButtonText}>
              {loading ? "Création..." : "Créer un compte"}
            </ThemedText>
          </TouchableOpacity>
          {submitError ? (
            <ThemedText style={styles.errorText}>{submitError}</ThemedText>
          ) : null}

          <ThemedView style={styles.signupRow}>
            <ThemedText style={styles.signupText}>
              Vous avez déjà un compte ?
            </ThemedText>
            <TouchableOpacity onPress={navigation.back} disabled={loading}>
              <ThemedText style={styles.signupLink}> Se connecter</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
