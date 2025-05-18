// components/personal/PersonalStepTwo.js
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

const PersonalStepTwo = ({ userData, onBack, onComplete, onSkip }: any) => {
  const [formData, setFormData] = useState({
    profilePicture: userData.profilePicture || null,
    coverPicture: userData.coverPicture || null,
    bio: userData.bio || "",
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

      <View style={styles.imagePickersContainer}>
        <ProfileImagePicker
          imageUri={formData.profilePicture}
          onImageSelected={(uri: any) =>
            handleImageSelected("profilePicture", uri)
          }
          title="Add Profile Pic"
        />

        <ProfileImagePicker
          imageUri={formData.coverPicture}
          onImageSelected={(uri: any) =>
            handleImageSelected("coverPicture", uri)
          }
          title="Add Cover Photo"
        />
      </View>

      <View style={styles.bioContainer}>
        <View style={styles.bioHeader}>
          <Ionicons name="create-outline" size={20} color="#B38051" />
          <Text style={styles.bioLabel}>Bio</Text>
        </View>
        <TextInput
          style={styles.bioInput}
          placeholder="Write a short bio about yourself..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={formData.bio}
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
    width: 44, // Same as backButton width to ensure title stays centered
  },
  imagePickersContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
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
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default PersonalStepTwo;
