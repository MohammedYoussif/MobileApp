import { StyleSheet } from "react-native";

export default StyleSheet.create({
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
  loginButton: {
    borderRadius: 8,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  signupText: {
    color: "#888",
    fontSize: 14,
  },
  signupLink: {
    fontWeight: "bold",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: "#888",
    borderRadius: 5,
    marginRight: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    borderColor: "#222",
    backgroundColor: "#e6f0ff",
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: "#222",
    borderRadius: 2,
  },
  termsText: {
    fontSize: 14,
  },
});
