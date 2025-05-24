import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CategoryResult() {
  const { back } = useRouter();
  const { categoryId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={back}>
        <ChevronLeft size={24} width={24} height={24} color="#B38051" />
      </TouchableOpacity>
      <Text>Details of category {categoryId} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
