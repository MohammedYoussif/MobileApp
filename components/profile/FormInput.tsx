// components/common/FormInput.js
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { KeyboardTypeOptions, StyleSheet, TextInput, View } from "react-native";

interface FormInputProps {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value?: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

const FormInput: React.FC<FormInputProps> = ({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
  autoCapitalize = "sentences",
}) => (
  <View style={styles.inputContainer}>
    <Ionicons name={icon} size={20} color="#B38051" style={styles.icon} />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
    />
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginVertical: 8,
    height: 48,
    backgroundColor: "#FFFFFF",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    fontFamily: "Cairo-Regular",
  },
});

export default FormInput;
