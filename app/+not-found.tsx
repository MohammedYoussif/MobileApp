import { Link, Stack, usePathname } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";

export default function NotFoundScreen() {
  const pathname = usePathname();

  alert("Current Path -> " + pathname);

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <ThemedText type="bold">This screen does not exist.</ThemedText>
        <Link href="/(auth)/(signin)" style={styles.link}>
          <ThemedText>Go to home screen!</ThemedText>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
