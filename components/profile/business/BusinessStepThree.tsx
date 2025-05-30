// components/business/BusinessStepThree.js
import { useAuth } from "@/context/auth.context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ActionButton from "../ActionButton";
import ProfileImagePicker from "../ProfileImagePicker";

const CategoryOption = ({
  icon,
  imageUri,
  id,
  name,
  selected,
  onSelect,
}: any) => {
  return (
    <TouchableOpacity
      style={[styles.categoryOption, selected && styles.selectedCategory]}
      onPress={() => onSelect(id)}
    >
      {icon && !imageUri && (
        <Ionicons
          name={icon}
          size={24}
          color={selected ? "#B38051" : "#999999"}
        />
      )}
      {imageUri && !icon && (
        <Image source={{ uri: imageUri }} style={styles.categoryImage} />
      )}
      <Text
        style={[styles.categoryName, selected && styles.selectedCategoryName]}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const BusinessStepThree = ({
  userData,
  onBack,
  onComplete,
  onSkip,
  formData,
  setFormData,
}: any) => {
  const { getCategories } = useAuth();

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
    onComplete(formData);
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <LinearGradient
        colors={['#fff', 'transparent']}
        style={styles.header}
      >
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Fill Your Profile</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <View style={styles.profileSection}>
        <View style={styles.coverPhotoContainer}>
          <ProfileImagePicker
            imageUri={userData?.coverPicture || formData?.coverPicture}
            onImageSelected={(uri: any) => {
              handleImageSelected("coverPicture", uri);
            }}
            cover
          />
        </View>

          <ProfileImagePicker
            imageUri={userData?.profilePicture || formData?.profilePicture}
            onImageSelected={(uri: any) => {
              handleImageSelected("profilePicture", uri);
            }}
            title="Add Profile Pic"
            size={120}
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
          value={userData?.bio || formData.bio}
          onChangeText={handleBioChange}
        />
      </View>

      <View style={styles.categorySection}>
        <Text style={styles.categoryTitle}>Choose Category</Text>
        <Text style={styles.categorySubtitle}>
          Select the fields you want to appear in
        </Text>

        <View style={styles.categoryOptions}>
          {getCategories().map((category: any) => (
            <CategoryOption
              key={category.id}
              id={category.id}
              imageUri={category.image_url}
              name={category.name}
              selected={formData.category === category.id}
              onSelect={handleCategorySelect}
            />
          ))}
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
    zIndex: 100,
    paddingHorizontal: 16
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
  profileSection: {
    position: "relative",
  },
  coverPhotoContainer: {
    width: "100%",
    marginBottom: -60, // Negative margin to allow profile pic overlap
  },
  bioContainer: {
    marginVertical: 20,
    paddingHorizontal: 16
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
    paddingHorizontal: 16
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
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    backgroundColor: "#F9F9F9",
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: "#B38051",
    backgroundColor: "#FAF5F0",
  },
  categoryImage: {
    width: 45,
    height: 45,
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
    paddingHorizontal: 16
  },
});

export default BusinessStepThree;

export { CategoryOption };
