import { StyleSheet } from "react-native";

export default StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 28,
    textAlign: "center",
    color: "#888",
  },
  label: {
    fontSize: 15,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
    fontSize: 13,
  },
  successText: {
    color: "green",
    marginBottom: 8,
    fontSize: 13,
    textAlign: "center",
  },
  submitButton: {
    borderRadius: 8,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
  },
  backLink: {
    color: "#0066cc",
    textDecorationLine: "underline",
    fontSize: 15,
  },
});
