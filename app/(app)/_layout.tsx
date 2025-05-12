// app/(app)/_layout.tsx
import { useAuth } from "@/context/auth.context";
import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Not logged in, redirect to sign in
    return <Redirect href="/(auth)/(signin)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
