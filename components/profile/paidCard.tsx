import React from "react";
import { StyleSheet, Text, View } from "react-native";

const PaidAccountCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          🎉 6 Months Free for Business Accounts!
        </Text>
      </View>
      <Text style={styles.description}>
        As a Business account user, you’ll get free access to all Bexpo features
        for the first 6 months from the day you register. After the trial
        period, a $100 monthly subscription will apply to continue enjoying
        premium features.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    color: "#333333",
    fontFamily: "Cairo-Bold",
  },
  description: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    fontFamily: "Cairo-Medium",
  },
});

export default PaidAccountCard;
