// components/AccountTypeSelector.js - Updated for integration with auth context
import { AccountType } from "@/types";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";

interface AccountTypeSelectorProps {
  selectedType: AccountType;
  onSelect: (type: AccountType) => void;
}

const AccountTypeSelector: React.FC<AccountTypeSelectorProps> = ({
  selectedType = "personal",
  onSelect,
}) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[
          styles.tab,
          selectedType === "personal" ? styles.activeTab : styles.inactiveTab,
        ]}
        onPress={() => onSelect("personal")}
      >
        <ThemedText
          style={
            selectedType === "personal"
              ? styles.activeTabText
              : styles.inactiveTabText
          }
        >
          Personal Account
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          selectedType === "business" ? styles.activeTab : styles.inactiveTab,
        ]}
        onPress={() => onSelect("business")}
      >
        <View style={styles.businessTabContent}>
          <ThemedText
            style={[
              selectedType === "business"
                ? styles.activeTabText
                : styles.inactiveTabText,
              styles.businessText,
            ]}
          >
            Business Account
          </ThemedText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#B38051",
    borderRadius: 6,
  },
  inactiveTab: {
    backgroundColor: "transparent",
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  inactiveTabText: {
    color: "#797979",
    fontWeight: "400",
  },
  businessTabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  businessText: {
    marginRight: 6,
  },
  paidTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5AA469",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  paidTagText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 10,
    marginLeft: 2,
  },
});

export default AccountTypeSelector;
