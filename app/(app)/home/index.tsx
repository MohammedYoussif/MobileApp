import BottomSheet from "@/components/common/BottomSheet";
import SearchCard from "@/components/common/SearchCard";
import { CategoryOption } from "@/components/profile/business/BusinessStepThree";
import { ThemedText } from "@/components/ThemedText";
import cities from "@/constants/cities";
import { useAuth } from "@/context/auth.context";
import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Home() {
  const { bottom } = useSafeAreaInsets();
  const { navigate } = useRouter();
  const { userProfile, getCategories, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);

  const snapPoints = [
    SCREEN_HEIGHT * 0.3, // 30% of screen height
    SCREEN_HEIGHT * 0.5, // 50% of screen height
    SCREEN_HEIGHT * 0.8, // 80% of screen height
  ];

  return (
    <View style={[styles.safeAreaContainer, { paddingBottom: bottom }]}>
      <View style={styles.headerContainer}>
        <View style={styles.filterIconContainer}>
          <TouchableOpacity onPress={() => setIsVisible(true)}>
            <Image
              width={35}
              height={35}
              resizeMode="center"
              source={require("@/assets/images/filter-icon.png")}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.userInfoContainer}>
          <ThemedText type="light">Hello,</ThemedText>
          <ThemedText type="bold">
            {userProfile?.accountType === "business"
              ? userProfile?.companyName
              : userProfile?.fullName}
          </ThemedText>
        </View>
        <View style={styles.profileImageContainer}>
          <Image
            width={50}
            height={50}
            source={{ uri: userProfile?.profilePicture ?? "" }}
          />
        </View>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.searchSection}>
          <SearchCard
            title="Search For The Company and person you want"
            placeholder="Search"
            onPress={() => {
              console.log("pressed");
            }}
          />
        </View>
        <View style={styles.pageContent}>
          <View style={styles.categoriesSection}>
            <View style={styles.categoryHeader}>
              <Text>Category</Text>
              <View style={styles.categoryOptions}>
                {getCategories().map((category: any) => (
                  <CategoryOption
                    key={category.id}
                    id={category.id}
                    imageUri={category.image_url}
                    name={category.name}
                    onSelect={(id: string) => {
                      navigate(`/category-result/${id}`);
                    }}
                  />
                ))}
              </View>
            </View>
          </View>
          <View style={styles.recommendedSection}>
            <Text>Most Recommended for you</Text>
          </View>
        </View>
      </ScrollView>
      <BottomSheet
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        snapPoints={snapPoints}
        enablePanDownToClose
        index={1}
      >
        {(handleClose) => {
          return (
            <View style={styles.contentContainer}>
              <ThemedText style={styles.title}>Switch City</ThemedText>
              <View
                style={{
                  alignSelf: "stretch",
                }}
              >
                <FlatList
                  data={cities}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.listItem}
                      onPress={() => {
                        handleClose();
                        setSelectedCity(item.id);
                      }}
                    >
                      <ThemedText style={styles.itemTitle}>
                        {item.name}
                      </ThemedText>
                      {selectedCity === item.id && (
                        <Check
                          size={24}
                          width={24}
                          height={24}
                          color="#B38051"
                        />
                      )}
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                  showsVerticalScrollIndicator={true}
                  contentContainerStyle={styles.listContainer}
                  scrollEnabled={true}
                />
              </View>
            </View>
          );
        }}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    gap: 16,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 16,
  },
  filterIconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.15 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    backgroundColor: "#fff",
  },
  userInfoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    overflow: "hidden",
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    gap: 16,
  },
  searchSection: {
    flex: 1,
  },
  pageContent: {
    flex: 6,
    gap: 16,
  },
  categoriesSection: {
    justifyContent: "center",
    gap: 16,
  },
  categoryHeader: {
    gap: 8,
  },
  categoryOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  recommendedSection: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginLeft: 16,
  },
});
