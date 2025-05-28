// components/common/ProfileImagePicker.js
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileImagePickerProps {
  imageUri?: string | null;
  onImageSelected: (uri: string) => void;
  title?: string;
  size?: number;
  cover?: boolean;
}

const ProfileImagePicker: React.FC<ProfileImagePickerProps> = ({
  imageUri,
  onImageSelected,
  title = "Add Profile Pic",
  size = 120,
  cover = false,
}) => {
  const [image, setImage] = useState<string | null | undefined>(imageUri);

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: cover ? [16, 9] : [1, 1], // Different aspect ratio for cover
      quality: 0.8,
    });

    console.log("Image Picker Result:", result);

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImage(result.assets[0].uri);
      onImageSelected(result.assets[0].uri);
    }
  };

  if (cover) {
    return (
      <View style={styles.coverContainer}>
        <TouchableOpacity style={styles.coverImageContainer} onPress={pickImage}>
            <Image source={image ? { uri: image } : require('@/assets/images/cover-default.png')} style={styles.coverImage} />
        </TouchableOpacity>
      </View>
    );
  } 

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.imageContainer, { width: size, height: size }]}
        onPress={pickImage}
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="person-outline" size={size / 3} color="#CCCCCC" />
          </View>
        )}
        <View style={styles.addButton}>
          <Ionicons name="add" size={size / 10} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 15,
    marginTop: 100,
  },
  imageContainer: {
    borderRadius: 100,
    position: "relative",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  placeholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#B38051",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    zIndex: 100,
  },
  title: {
    marginTop: 8,
    fontSize: 16,
    color: "#333333",
  },
  // Cover-specific styles
  coverContainer: {
    width: "100%",
    position: "absolute",
    top: -100,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  coverImageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  coverPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
  },
  coverPlaceholderText: {
    marginTop: 8,
    fontSize: 16,
    color: "#888888",
    fontWeight: "500",
  },
  coverAddButton: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});

export default ProfileImagePicker;