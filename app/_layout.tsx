import { AuthProvider, useAuth } from "@/context/auth.context";
import { determineLanguage, setAppLanguage } from "@/utils/language";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import FlashMessage from "react-native-flash-message";
import "react-native-reanimated";

const INTRO_COMPLETED_KEY = "introCompleted";

SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const router = useRouter();
  const { authInitialized } = useAuth();
  const [fontsLoaded] = useFonts({
    "Cairo-Regular": require("../assets/fonts/Cairo-Regular.ttf"),
    "Cairo-Bold": require("../assets/fonts/Cairo-Bold.ttf"),
    "Cairo-SemiBold": require("../assets/fonts/Cairo-SemiBold.ttf"),
    "Cairo-Light": require("../assets/fonts/Cairo-Light.ttf"),
    "Cairo-Medium": require("../assets/fonts/Cairo-Medium.ttf"),
  });

  const [languageInitialized, setLanguageInitialized] = useState(false);
  const [introChecked, setIntroChecked] = useState(false);

  // Check if intro has been completed
  useEffect(() => {
    const checkIntroStatus = async () => {
      try {
        const introCompleted = await AsyncStorage.getItem(INTRO_COMPLETED_KEY);

        if (introCompleted === "true") {
          router.replace("/(auth)/(signin)");
        }

        setIntroChecked(true);
      } catch (error) {
        console.error("Failed to check intro status:", error);
        setIntroChecked(true);
      }
    };

    if (authInitialized && fontsLoaded && languageInitialized) {
      checkIntroStatus();
    }
  }, [authInitialized, fontsLoaded, languageInitialized, router]);

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
    if (authInitialized && fontsLoaded && languageInitialized && introChecked) {
      SplashScreen.hideAsync();
    }
  }, [authInitialized, fontsLoaded, languageInitialized, introChecked]);

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
