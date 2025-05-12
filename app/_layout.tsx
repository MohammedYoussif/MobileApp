import { AuthProvider, useAuth } from "@/context/auth.context";
import { determineLanguage, setAppLanguage } from "@/utils/language";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import FlashMessage from "react-native-flash-message";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const { authInitialized } = useAuth();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
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

  // Hide splash screen when everything is initialized
  useEffect(() => {
    if (authInitialized && fontsLoaded && languageInitialized) {
      SplashScreen.hideAsync();
    }
  }, [authInitialized, fontsLoaded, languageInitialized]);

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
        <StatusBar
          style="auto"
          backgroundColor={colorScheme === "dark" ? "#151718" : "#FFFFFF"}
        />
        <FlashMessage position="top" />
      </ThemeProvider>
    </AuthProvider>
  );
}
