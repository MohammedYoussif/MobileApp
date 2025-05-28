// app/(app)/_layout.tsx
import { useAuth } from "@/context/auth.context";
import { Redirect, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppLayout() {
  const { currentUser } = useAuth();
  const { top, bottom } = useSafeAreaInsets();

  if (!currentUser) {
    // Not logged in, redirect to sign in
    return <Redirect href="/(auth)/(signin)" />;
  }

  return <Stack screenOptions={{ headerShown: false, contentStyle: { paddingTop: top, backgroundColor: '#fff' } }} />;
}
