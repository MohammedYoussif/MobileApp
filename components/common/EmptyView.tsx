import { ThemedText } from "@/components/ThemedText";
import { Image, StyleSheet, View } from "react-native";

interface EmptyViewProps {
  title?: string;
  message?: string;
  imageUrl?: string;
}

export default function EmptyView({
  title = "No Data Found",
  message = "There are no items to display at the moment",
  imageUrl = "https://dummyimage.com/200x200/ffffff/b38051&text=No+Data",
}: EmptyViewProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.textContainer}>
        <ThemedText type="bold" style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText type="regular" style={styles.message}>
          {message}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    color: "#B38051",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
});
