import SubscriptionButton from "@/components/SubscriptionButton";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/auth.context";
import { Button, View } from "react-native";

export default function Home() {
  const { logout } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ThemedText>Welcome to the Home!</ThemedText>
      <SubscriptionButton />
      <Button title="logout" onPress={logout} color="red" />
    </View>
  );
}
