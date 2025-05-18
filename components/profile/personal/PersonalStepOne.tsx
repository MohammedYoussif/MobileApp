// components/personal/PersonalStepOne.js
import { ThemedText } from "@/components/ThemedText";
import { AccountType, UserProfile } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AccountTypeSelector from "../AccountTypeSelector";
import ActionButton from "../ActionButton";
import FormInput from "../FormInput";

interface PersonalStepOneProps {
  userData: UserProfile;
  onContinue: (data: Partial<UserProfile>) => void;
  onSkip: () => void;
  accountType: AccountType;
  onAccountTypeChange: (type: AccountType) => void;
}

const PersonalStepOne: React.FC<PersonalStepOneProps> = ({
  userData,
  onContinue,
  onSkip,
  accountType,
  onAccountTypeChange,
}) => {
  const [formData, setFormData] = useState({
    fullName: userData.fullName || "",
    dateOfBirth: userData.dateOfBirth || "",
    email: userData.email || "",
    city: userData.city || "",
    whatsappBusiness: userData.whatsappBusiness || "",
    contactPerson: userData.contactPerson || "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
      handleChange("dateOfBirth", formattedDate);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
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

      <View style={styles.form}>
        <FormInput
          icon="person-outline"
          placeholder="Full Name"
          value={formData.fullName}
          onChangeText={(text) => handleChange("fullName", text)}
        />

        <TouchableOpacity onPress={showDatepicker}>
          <View style={styles.dateInput}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#B38051"
              style={styles.icon}
            />
            <ThemedText
              style={
                formData.dateOfBirth ? styles.dateText : styles.placeholderText
              }
            >
              {formData.dateOfBirth || "Date Of Birth"}
            </ThemedText>
          </View>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={
              formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date()
            }
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

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
        <ActionButton title="Continue" onPress={handleSubmit} />
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
  form: {
    marginTop: 10,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 8,
    height: 48,
    backgroundColor: "#FFFFFF",
  },
  icon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    fontSize: 16,
    color: "#999",
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default PersonalStepOne;
