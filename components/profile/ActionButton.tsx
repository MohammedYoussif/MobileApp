// components/common/ActionButton.js
import React from "react";
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { ThemedText } from "../ThemedText";

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  primary?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  onPress,
  primary = true,
  style = {},
  textStyle = {},
}) => (
  <TouchableOpacity
    style={[
      styles.button,
      primary ? styles.primaryButton : styles.secondaryButton,
      style,
    ]}
    onPress={onPress}
  >
    <ThemedText
      type={primary ? "regular" : "bold"}
      style={[
        styles.buttonText,
        primary ? styles.primaryButtonText : styles.secondaryButtonText,
        textStyle,
      ]}
    >
      {title}
    </ThemedText>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: "#B38051",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#B38051",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButtonText: {
    color: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#B38051",
  },
});

export default ActionButton;
