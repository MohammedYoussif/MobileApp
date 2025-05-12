// app/(auth)/_layout.tsx
import { useAuth } from "@/context/auth.context";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { currentUser } = useAuth();

  if (currentUser) {
    // Already logged in, redirect to app home
    return <Redirect href="/(app)/(home)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
