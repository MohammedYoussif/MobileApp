import { ThemedText } from "@/components/ThemedText";
import categories from "@/constants/categories.json";
import { useAuth } from "@/context/auth.context";
import { Search } from "lucide-react-native";
import { FlatList, Image, SafeAreaView, Text, View } from "react-native";

export default function Home() {
  const { userProfile, logout } = useAuth();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        marginHorizontal: 24,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          marginBottom: 16,
          // backgroundColor: "#097",
        }}
      >
        <View
          style={{
            width: 50,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
            // borderWidth: StyleSheet.hairlineWidth,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Image
            width={35}
            height={35}
            resizeMode="center"
            source={require("@/assets/images/filter-icon.png")}
          />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: "#ff0",
          }}
        >
          <ThemedText type="light">Hello,</ThemedText>
          <ThemedText type="bold">
            {userProfile?.accountType === "business"
              ? userProfile?.companyName
              : userProfile?.fullName}
          </ThemedText>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
            overflow: "hidden",
            // backgroundColor: "#f0a",
          }}
        >
          <Image
            width={50}
            height={50}
            source={{ uri: userProfile?.profilePicture ?? "" }}
          />
        </View>
      </View>
      <View
        style={{
          flex: 2,
        }}
      >
        <View
          style={{
            flex: 1,
            // alignSelf: "flex-start",
            justifyContent: "center",
            // alignItems: "center",
            gap: 16,
            borderRadius: 8,
            paddingHorizontal: 20,
            backgroundColor: "#B38051A3",
          }}
        >
          <View style={{ paddingEnd: 96 }}>
            <ThemedText type="bold" lightColor="#fff" style={{ fontSize: 18 }}>
              Search For The Company and person you want
            </ThemedText>
          </View>
          <View
            style={{
              flexDirection: "row",
              height: 45,
              gap: 8,
              alignItems: "center",
              paddingHorizontal: 16,
              borderRadius: 6,
              backgroundColor: "#F2F3ED8A",
            }}
          >
            <Search size={24} width={24} height={24} color="#fff" />
            <ThemedText
              type="medium"
              lightColor="#fff"
              style={{ marginTop: 2 }}
            >
              Search
            </ThemedText>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 8,
          justifyContent: "center",
          // alignItems: "center",
          marginTop: 16,
          gap: 16,
          backgroundColor: "#f80",
        }}
      >
        <View style={{ gap: 8, backgroundColor: "#3fa" }}>
          <Text>Category</Text>
          <View style={{ backgroundColor: "#a9e" }}>
            <FlatList
              data={categories}
              numColumns={3}
              columnWrapperStyle={{
                marginVertical: 8,
              }}
              renderItem={({ item }) => (
                <View
                  style={{
                    flex: 1,
                    height: 104,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 16,
                    marginHorizontal: 8,
                    backgroundColor: "#e87",
                  }}
                >
                  <Text>{item.name}</Text>
                </View>
              )}
            />
          </View>
        </View>
        <View style={{ flex: 1, backgroundColor: "#f0f" }}>
          <Text>Most Recommended for you</Text>
        </View>
      </View>
      {/* <ThemedText>Welcome to the Home!</ThemedText>
      <SubscriptionButton />
      <Button title="logout" onPress={logout} color="red" /> */}
    </SafeAreaView>
  );
}
