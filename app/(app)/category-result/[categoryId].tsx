import BottomSheet from "@/components/common/BottomSheet";
import SearchCard from "@/components/common/SearchCard";
import { ThemedText } from "@/components/ThemedText";
import categoryOptions, {
  CategoryOptionsTypes,
} from "@/constants/categoryOptions";
import results from "@/constants/results";
import { useAuth } from "@/context/auth.context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowDownUp, Check, ChevronLeft, Funnel } from "lucide-react-native";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function CategoryResult() {
  const { back } = useRouter();
  const { getCategoryNameById } = useAuth();
  const { categoryId } = useLocalSearchParams();
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

  const categoryResults = results[categoryId as keyof typeof results];

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
          <FlatList
            data={categoryResults}
            numColumns={2}
            contentContainerStyle={styles.listContainerContent}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity style={styles.resultItem}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.resultImage}
                  />
                  <View style={styles.resultInfo}>
                    <ThemedText type="bold" style={styles.resultInfoText}>
                      {item.name}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
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
        {(handleClose) => {
          return (
            <View style={styles.contentContainer}>
              <View
                style={{
                  alignSelf: "stretch",
                }}
              >
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
                      <Text style={styles.itemTitle}>{item.name}</Text>
                      {((sheetState?.sheetType === CategoryOptionsTypes.SORT &&
                        selectedSortOption === item.id) ||
                        (sheetState?.sheetType ===
                          CategoryOptionsTypes.FILTER &&
                          selectedFilterOption === item.id)) && (
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
                  contentContainerStyle={styles.sheetListContainer}
                  scrollEnabled={true}
                />
              </View>
            </View>
          );
        }}
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
    paddingHorizontal: 16,
    gap: 16,
  },
  listContainer: {
    flex: 3,
    gap: 16,
  },
  resultItem: {
    flex: 1,
    width: "45%",
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
  },
  columnWrapper: {
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
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
