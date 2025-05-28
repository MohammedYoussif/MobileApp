// components/business/BusinessStepThree.js
import { useAuth } from "@/context/auth.context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import ActionButton from "../ActionButton";
import ProfileImagePicker from "../ProfileImagePicker";


const PersonalStepTwo = ({
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
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
    paddingHorizontal: 16
  },
});

export default PersonalStepTwo;
