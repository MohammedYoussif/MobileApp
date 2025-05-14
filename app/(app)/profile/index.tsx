import { ThemedText } from "@/components/ThemedText";
import { View } from "react-native";

export default function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ThemedText>Welcome to the Profile!</ThemedText>
    </View>
  );
}
