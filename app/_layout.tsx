import { AuthProvider, useAuth } from "@/context/auth.context";
import { determineLanguage, setAppLanguage } from "@/utils/language";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import FlashMessage from "react-native-flash-message";
import "react-native-reanimated";

function AppNavigator() {
  const { authInitialized } = useAuth();
  const [fontsLoaded] = useFonts({
    "Cairo-Regular": require("../assets/fonts/Cairo-Regular.ttf"),
    "Cairo-Bold": require("../assets/fonts/Cairo-Bold.ttf"),
    "Cairo-SemiBold": require("../assets/fonts/Cairo-SemiBold.ttf"),
    "Cairo-Light": require("../assets/fonts/Cairo-Light.ttf"),
    "Cairo-Medium": require("../assets/fonts/Cairo-Medium.ttf"),
  });

  const [languageInitialized, setLanguageInitialized] = useState(false);

  useEffect(() => {
    const setupLanguage = async () => {
      try {
        const language = await determineLanguage();
        await setAppLanguage(language);
        setLanguageInitialized(true);
      } catch (error) {
        console.error("Failed to initialize language:", error);
        setLanguageInitialized(true);
      }
    };

    setupLanguage();
  }, []);

  if (!authInitialized || !fontsLoaded || !languageInitialized) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AppNavigator />
        <StatusBar style="dark" backgroundColor={"#FFFFFF"} />
        <FlashMessage position="top" />
      </ThemeProvider>
    </AuthProvider>
  );
}
