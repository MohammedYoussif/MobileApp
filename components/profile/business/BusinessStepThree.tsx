// components/business/BusinessStepThree.js
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ActionButton from "../ActionButton";
import ProfileImagePicker from "../ProfileImagePicker";

const CategoryOption = ({ icon, name, selected, onSelect }: any) => {
  return (
    <TouchableOpacity
      style={[styles.categoryOption, selected && styles.selectedCategory]}
      onPress={() => onSelect(name)}
    >
      <Ionicons
        name={icon}
        size={24}
        color={selected ? "#B38051" : "#999999"}
      />
      <Text
        style={[styles.categoryName, selected && styles.selectedCategoryName]}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const BusinessStepThree = ({ userData, onBack, onComplete, onSkip }: any) => {
  const [formData, setFormData] = useState({
    profilePicture: userData.profilePicture || null,
    coverPicture: userData.coverPicture || null,
    bio: userData.bio || "",
    category: userData.category || "",
  });

  const handleImageSelected = (type: any, uri: any) => {
    setFormData({
      ...formData,
      [type]: uri,
    });
  };

  const handleBioChange = (text: any) => {
    setFormData({
      ...formData,
      bio: text,
    });
  };

  const handleCategorySelect = (category: any) => {
    setFormData({
      ...formData,
      category,
    });
  };

  const handleSubmit = () => {
    // Submit the profile data
    onComplete(formData);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Fill Your Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.profilePicSection}>
        <ProfileImagePicker
          imageUri={formData.profilePicture}
          onImageSelected={(uri: any) =>
            handleImageSelected("profilePicture", uri)
          }
          title="Add Profile Pic"
        />
      </View>

      <View style={styles.bioContainer}>
        <View style={styles.bioHeader}>
          <Ionicons name="create-outline" size={20} color="#B38051" />
          <Text style={styles.bioLabel}>Bio</Text>
        </View>
        <TextInput
          style={styles.bioInput}
          placeholder="Write a short bio about your business..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={formData.bio}
          onChangeText={handleBioChange}
        />
      </View>

      <View style={styles.categorySection}>
        <Text style={styles.categoryTitle}>Choose Category</Text>
        <Text style={styles.categorySubtitle}>
          Select the fields you want to appear in
        </Text>

        <View style={styles.categoryOptions}>
          <CategoryOption
            icon="restaurant-outline"
            name="Restaurant"
            selected={formData.category === "Restaurant"}
            onSelect={handleCategorySelect}
          />

          <CategoryOption
            icon="medkit-outline"
            name="Medical care"
            selected={formData.category === "Medical care"}
            onSelect={handleCategorySelect}
          />

          <CategoryOption
            icon="business-outline"
            name="Hotel"
            selected={formData.category === "Hotel"}
            onSelect={handleCategorySelect}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <ActionButton title="Complete Registration" onPress={handleSubmit} />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  placeholder: {
    width: 44,
  },
  profilePicSection: {
    alignItems: "center",
    marginVertical: 10,
  },
  bioContainer: {
    marginVertical: 20,
  },
  bioHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  bioLabel: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 10,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 8,
    padding: 15,
    height: 120,
    fontSize: 16,
    color: "#333",
  },
  categorySection: {
    marginVertical: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  categorySubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  categoryOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  categoryOption: {
    width: "30%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: "#B38051",
    backgroundColor: "#FAF5F0",
  },
  categoryName: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
    color: "#666",
  },
  selectedCategoryName: {
    color: "#B38051",
    fontWeight: "600",
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default BusinessStepThree;
