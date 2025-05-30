import BottomSheet from "@/components/common/BottomSheet";
import EmptyView from "@/components/common/EmptyView";
import SearchCard from "@/components/common/SearchCard";
import { ThemedText } from "@/components/ThemedText";
import categoryOptions, {
  CategoryOptionsTypes,
} from "@/constants/categoryOptions";
import { useAuth } from "@/context/auth.context";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowDownUp, Check, ChevronLeft, Funnel } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function CategoryResult() {
  const { back } = useRouter();
  const { getCategoryNameById } = useAuth();
  const { categoryId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [sheetState, setSheetState] = useState<
    | {
        isVisible: false;
        sheetType?: undefined;
      }
    | {
        isVisible: true;
        sheetType: CategoryOptionsTypes;
      }
  >({
    isVisible: false,
  });
  const [selectedSortOption, setSelectedSortOption] = useState<
    number | undefined
  >(undefined);
  const [selectedFilterOption, setSelectedFilterOption] = useState<
    number | undefined
  >(undefined);
  const snapPoints = [
    SCREEN_HEIGHT * 0.15, // 15% of screen height
  ];

  useEffect(() => {
    fetchProfiles();
  }, [categoryId, selectedSortOption, selectedFilterOption]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("user_profiles")
        .select("*")
        .eq("category_id", categoryId);

      // Apply sorting if selected
      if (selectedSortOption === 1) {
        query = query.order("full_name", { ascending: true }); // TODO: change to rate
      } else if (selectedSortOption === 2) {
        query = query.order("full_name", { ascending: false }); // TODO: change to rate
      }

      // Apply filters if selected
      if (selectedFilterOption === 1) {
        query = query.eq("account_type", "business");
      } else if (selectedFilterOption === 2) {
        query = query.eq("account_type", "personal");
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching profiles:", error);
        return;
      }

      setProfiles(
        data.map((profile) => ({
          id: profile.id,
          fullName: profile.full_name || "",
          dateOfBirth: profile.date_of_birth || "",
          email: profile.email || "",
          city: profile.city || "",
          whatsappBusiness: profile.whatsapp_business || "",
          contactPerson: profile.contact_person || "",
          bio: profile.bio || "",
          companyName: profile.company_name || "",
          profilePicture: profile.profile_picture || null,
          coverPicture: profile.cover_picture || null,
          category: profile.category_id || null,
          categoryId: profile.category_id || null,
          categoryName: profile.category_name || "",
          categoryImageUrl: profile.category_image_url || null,
          accountType: profile.account_type || "personal",
          socialLinks: profile.social_links || {
            instagram: "",
            twitter: "",
            whatsapp: "",
          },
          createdAt: profile.created_at,
          updatedAt: profile.updated_at,
        }))
      );
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (id: number) => {
    if (sheetState?.sheetType === CategoryOptionsTypes.SORT) {
      setSelectedSortOption(selectedSortOption === id ? undefined : id);
    } else if (sheetState?.sheetType === CategoryOptionsTypes.FILTER) {
      setSelectedFilterOption(selectedFilterOption === id ? undefined : id);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={back}>
            <ChevronLeft size={24} width={24} height={24} color="#B38051" />
          </TouchableOpacity>
        </View>
        <ThemedText type="semiBold" style={styles.headerTitle}>
          {getCategoryNameById(categoryId as string)}
        </ThemedText>
      </View>
      <View style={styles.pageContainer}>
        <View style={styles.searchSection}>
          <SearchCard
            title="Search For The Company and person you want"
            placeholder="Search"
            onPress={() => {
              console.log("pressed");
            }}
          />
        </View>
        <View style={styles.listContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#B38051" />
            </View>
          ) : (
            <FlatList
              data={profiles}
              numColumns={2}
              contentContainerStyle={styles.listContainerContent}
              columnWrapperStyle={styles.columnWrapper}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity style={styles.resultItem}>
                    <Image
                      source={{
                        uri:
                          item.profilePicture ||
                          "https://dummyimage.com/165x165/ffffff/b38051&text=No+Profile+Image",
                      }}
                      style={styles.resultImage}
                    />
                    <View style={styles.resultInfo}>
                      <ThemedText type="bold" style={styles.resultInfoText}>
                        {item.accountType === "business"
                          ? item.companyName
                          : item.fullName}
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <EmptyView
                  title="No profiles found"
                  message="Please try again later"
                  imageUrl="https://dummyimage.com/200x200/ffffff/b38051&text=No+Profiles"
                />
              }
              keyExtractor={(item) => item.id}
            />
          )}
        </View>
      </View>
      {profiles.length > 0 && (
        <View style={styles.floatingContainer}>
          <TouchableOpacity
            style={styles.floatingContainerItem}
            onPress={() =>
              setSheetState({
                isVisible: true,
                sheetType: CategoryOptionsTypes.SORT,
              })
            }
          >
            <ThemedText type="semiBold" style={{ fontSize: 14, color: "#fff" }}>
              Sort
            </ThemedText>
            <ArrowDownUp size={12} style={styles.floatingContainerIcon} />
          </TouchableOpacity>
          <View style={styles.floatingContainerSeparatorContainer}>
            <View style={styles.floatingContainerSeparator} />
          </View>
          <TouchableOpacity
            style={styles.floatingContainerItem}
            onPress={() =>
              setSheetState({
                isVisible: true,
                sheetType: CategoryOptionsTypes.FILTER,
              })
            }
          >
            <ThemedText type="semiBold" style={{ fontSize: 14, color: "#fff" }}>
              Filter
            </ThemedText>
            <Funnel size={12} style={styles.floatingContainerIcon} />
          </TouchableOpacity>
        </View>
      )}
      <BottomSheet
        isVisible={sheetState?.isVisible}
        onClose={() =>
          setSheetState({
            isVisible: false,
          })
        }
        snapPoints={snapPoints}
        enablePanDownToClose
        index={1}
      >
        {(handleClose) => (
          <View style={styles.contentContainer}>
            <View style={{ alignSelf: "stretch" }}>
              <FlatList
                data={
                  categoryOptions[
                    sheetState?.sheetType || CategoryOptionsTypes.EMPTY
                  ]
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => {
                      handleClose();
                      handleItemPress(item.id);
                    }}
                  >
                    <ThemedText style={styles.itemTitle}>
                      {item.name}
                    </ThemedText>
                    {((sheetState?.sheetType === CategoryOptionsTypes.SORT &&
                      selectedSortOption === item.id) ||
                      (sheetState?.sheetType === CategoryOptionsTypes.FILTER &&
                        selectedFilterOption === item.id)) && (
                      <Check size={24} width={24} height={24} color="#B38051" />
                    )}
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.sheetListContainer}
                scrollEnabled={true}
              />
            </View>
          </View>
        )}
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  headerLeft: {
    position: "absolute",
    left: 20,
  },
  headerTitle: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchSection: {
    flex: 1,
  },
  pageContainer: {
    flex: 6,
    width: "100%",
    paddingHorizontal: 16,
    gap: 16,
  },
  listContainer: {
    flex: 3,
    gap: 16,
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  resultItem: {
    width: "48%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: "#fff",
  },
  resultImage: {
    width: "100%",
    height: 165,
    borderRadius: 16,
    resizeMode: "cover",
  },
  resultInfo: {
    flex: 1,
    textAlignVertical: "center",
    paddingHorizontal: 16,
  },
  resultInfoText: {
    textAlign: "center",
  },
  listContainerContent: {
    paddingBottom: 64,
    width: "100%",
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  floatingContainer: {
    flexDirection: "row",
    width: "40%",
    height: 40,
    position: "absolute",
    bottom: 48,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#B38051",
  },
  floatingContainerSeparatorContainer: {
    width: 1,
    justifyContent: "center",
  },
  floatingContainerSeparator: {
    height: 24,
    backgroundColor: "#fff",
  },
  floatingContainerItem: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingContainerIcon: {
    color: "#fff",
    marginBottom: 4,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  sheetListContainer: {
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
