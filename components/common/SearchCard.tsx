import { Search } from "lucide-react-native";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { ThemedText } from "../ThemedText";

type SearchCardProps = {
  title: string;
  placeholder: string;
  onPress: () => void;
};

const SearchCard = ({ title, placeholder, onPress }: SearchCardProps) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.searchBox}>
        <View style={styles.searchTextContainer}>
          <ThemedText type="bold" lightColor="#fff" style={styles.searchTitle}>
            {title}
          </ThemedText>
        </View>
        <View style={styles.searchInputContainer}>
          <Search size={24} width={24} height={24} color="#fff" />
          <ThemedText
            type="medium"
            lightColor="#fff"
            style={styles.searchPlaceholder}
          >
            {placeholder}
          </ThemedText>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  searchBox: {
    flex: 1,
    justifyContent: "center",
    gap: 16,
    borderRadius: 8,
    paddingHorizontal: 20,
    backgroundColor: "#B38051",
  },
  searchTextContainer: {
    paddingEnd: 96,
  },
  searchTitle: {
    fontSize: 18,
  },
  searchInputContainer: {
    flexDirection: "row",
    height: 45,
    gap: 8,
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#F2F3ED8A",
  },
  searchPlaceholder: {
    marginTop: 2,
  },
});

export default SearchCard;
