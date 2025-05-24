// components/business/BusinessStepTwo.js
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ActionButton from "../ActionButton";

const SocialMediaLink = ({ icon, platform, value, onChangeText }: any) => {
  return (
    <View style={styles.socialMediaContainer}>
      <View style={styles.socialIconContainer}>
        <Ionicons name={icon} size={22} color="#FFFFFF" />
      </View>
      <View style={styles.socialInputContainer}>
        <Text style={styles.socialPlatform}>{platform}</Text>
        <TextInput
          style={styles.socialInput}
          placeholder={`Add your ${platform} URL`}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          keyboardType="url"
        />
      </View>
    </View>
  );
};

const BusinessStepTwo = ({
  userData,
  onContinue,
  onBack,
  onSkip,
  socialLinks,
  setSocialLinks,
}: any) => {
  /* const [socialLinks, setSocialLinks] = useState({
    instagram: userData.socialLinks?.instagram || "",
    twitter: userData.socialLinks?.twitter || "",
    whatsapp: userData.socialLinks?.whatsapp || "",
  }); */

  const handleSocialLinkChange = (platform: any, value: any) => {
    setSocialLinks({
      ...socialLinks,
      [platform]: value,
    });
  };

  const handleSubmit = () => {
    // Validate and continue to next step
    onContinue({ socialLinks });
  };

  const handleAddNew = () => {
    // This would typically open a modal to add new social media platforms
    console.log("Add new social media link");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Fill Your Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.socialMediaList}>
        <SocialMediaLink
          icon="logo-instagram"
          platform="Instagram"
          value={socialLinks.instagram}
          onChangeText={(text: any) =>
            handleSocialLinkChange("instagram", text)
          }
        />

        <SocialMediaLink
          icon="logo-twitter"
          platform="X"
          value={socialLinks.twitter}
          onChangeText={(text: any) => handleSocialLinkChange("twitter", text)}
        />

        <SocialMediaLink
          icon="logo-whatsapp"
          platform="WhatsApp"
          value={socialLinks.whatsapp}
          onChangeText={(text: any) => handleSocialLinkChange("whatsapp", text)}
        />

        <TouchableOpacity style={styles.addNewContainer} onPress={handleAddNew}>
          <Text style={styles.addNewText}>Add New</Text>
          <Text style={styles.addNewSubtext}>
            Add new link as business or personal
          </Text>

          <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </TouchableOpacity>
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
  socialMediaList: {
    marginTop: 20,
  },
  socialMediaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 15,
  },
  socialIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#B38051",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  socialInputContainer: {
    flex: 1,
  },
  socialPlatform: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  socialInput: {
    fontSize: 16,
    color: "#666",
  },
  addNewContainer: {
    marginVertical: 12,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 15,
    position: "relative",
  },
  addNewText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  addNewSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  addButton: {
    position: "absolute",
    right: 15,
    top: "50%",
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#B38051",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default BusinessStepTwo;
