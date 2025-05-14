import { AuthProvider, useAuth } from "@/context/auth.context";
import { determineLanguage, setAppLanguage } from "@/utils/language";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StatusBar as NativeStatusBar, useColorScheme } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import "react-native-reanimated";

function AppNavigator() {
  const { authInitialized, setResetParams } = useAuth();
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

    // When the app is opened from a cold start
    Linking.getInitialURL().then((url) => {
      if (url) {
        const parsedUrl = new URL(url.replace("#", "?"));
        const params = parsedUrl.searchParams;

        const error = params.get("error");
        const errorDescription = params.get("error_description");
        if (url.includes("access_token=")) {
          showMessage({
            message: "Success",
            description: "Email has been verified successfully.",
            type: "success",
            duration: 4000,
          });
        }

        if (error) {
          showMessage({
            message: "Error",
            description:
              errorDescription || "Email has been verified successfully.",
            type: "danger",
            duration: 6000,
          });
        }
      }
    });

    // When the app is already running and receives a link
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log(url);
      const parsedUrl = new URL(url.replace("#", "?"));
      const params = parsedUrl.searchParams;

      const error = params.get("error");
      const errorDescription = params.get("error_description");
      if (url.includes("token_type=bearer&type=signup")) {
        showMessage({
          message: "Success",
          description: "Email has been verified successfully.",
          type: "success",
          duration: 4000,
        });
      }

      if (error) {
        showMessage({
          message: "Error",
          description:
            errorDescription || "Email has been verified successfully.",
          type: "danger",
          duration: 6000,
        });
      }
    });

    setupLanguage();
    return () => {
      subscription.remove();
    };
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
        <FlashMessage
          position="top"
          statusBarHeight={NativeStatusBar.currentHeight}
        />
      </ThemeProvider>
    </AuthProvider>
  );
}
