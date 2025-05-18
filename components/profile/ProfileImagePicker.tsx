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
}

const ProfileImagePicker: React.FC<ProfileImagePickerProps> = ({
  imageUri,
  onImageSelected,
  title = "Add Profile Pic",
  size = 120,
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
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImage(result.assets[0].uri);
      onImageSelected(result.assets[0].uri);
    }
  };

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
  },
  imageContainer: {
    borderRadius: 100,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
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
    bottom: 0,
    right: 0,
    backgroundColor: "#B38051",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  title: {
    marginTop: 8,
    fontSize: 16,
    color: "#333333",
  },
});

export default ProfileImagePicker;
