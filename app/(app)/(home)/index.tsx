import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/auth.context";
import { Button } from "react-native";

export default function Home() {
  const { logout } = useAuth();

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ThemedText>Welcome to the Home!</ThemedText>
      <Button title="logout" onPress={logout} color="red" />
    </ThemedView>
  );
}
