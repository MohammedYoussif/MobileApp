import { Tabs } from "expo-router";
import { Image } from "react-native";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarActiveTintColor: "#B38051",
          tabBarIcon: ({ focused }) => (
            <Image
              width={24}
              height={24}
              resizeMode="contain"
              source={
                focused
                  ? require("@/assets/images/home-tab-active.png")
                  : require("@/assets/images/home-tab-inactive.png")
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarActiveTintColor: "#B38051",
          tabBarIcon: ({ focused }) => (
            <Image
              width={24}
              height={24}
              resizeMode="contain"
              source={
                focused
                  ? require("@/assets/images/add-tab-active.png")
                  : require("@/assets/images/add-tab-inactive.png")
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarActiveTintColor: "#B38051",
          tabBarIcon: ({ focused }) => (
            <Image
              width={24}
              height={24}
              resizeMode="contain"
              source={
                focused
                  ? require("@/assets/images/profile-tab-active.png")
                  : require("@/assets/images/profile-tab-inactive.png")
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}
