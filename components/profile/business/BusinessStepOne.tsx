// components/business/BusinessStepOne.js
import { AccountType, UserProfile } from "@/types";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AccountTypeSelector from "../AccountTypeSelector";
import ActionButton from "../ActionButton";
import FormInput from "../FormInput";
import PaidAccountCard from "../paidCard";

interface BusinessStepOneProps {
  userData: UserProfile;
  onContinue: (data: Partial<UserProfile>) => void;
  onSkip: () => void;
  accountType: AccountType;
  onAccountTypeChange: (type: AccountType) => void;
}

const BusinessStepOne: React.FC<BusinessStepOneProps> = ({
  userData,
  onContinue,
  onSkip,
  accountType,
  onAccountTypeChange,
}) => {
  const [formData, setFormData] = useState({
    companyName: userData.companyName || "",
    email: userData.email || "",
    city: userData.city || "",
    whatsappBusiness: userData.whatsappBusiness || "",
    contactPerson: userData.contactPerson || "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    // Validate form here if needed
    onContinue({
      ...formData,
      accountType,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      <Text style={styles.title}>Fill Your Profile</Text>

      <AccountTypeSelector
        selectedType={accountType}
        onSelect={onAccountTypeChange}
      />

      {/* Paid Account Badge */}
      <PaidAccountCard />

      <View style={styles.form}>
        <FormInput
          icon="business-outline"
          placeholder="Name Of The Company"
          value={formData.companyName}
          onChangeText={(text) => handleChange("companyName", text)}
        />

        <FormInput
          icon="mail-outline"
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <FormInput
          icon="location-outline"
          placeholder="City"
          value={formData.city}
          onChangeText={(text) => handleChange("city", text)}
        />

        <FormInput
          icon="logo-whatsapp"
          placeholder="WhatsApp Business"
          value={formData.whatsappBusiness}
          onChangeText={(text) => handleChange("whatsappBusiness", text)}
          keyboardType="phone-pad"
        />

        <FormInput
          icon="call-outline"
          placeholder="Contact Person"
          value={formData.contactPerson}
          onChangeText={(text) => handleChange("contactPerson", text)}
        />
      </View>

      <View style={styles.buttonContainer}>
        <ActionButton title="Next" onPress={handleSubmit} />
        <ActionButton title="Skip" onPress={onSkip} primary={false} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 20,
  },
  badgeContainer: {
    alignItems: "flex-end",
    marginVertical: 10,
  },
  paidBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5AA469",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  paidBadgeText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
    marginLeft: 4,
  },
  form: {
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default BusinessStepOne;
