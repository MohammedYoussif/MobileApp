import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 28,
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
  passwordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forgot: {
    textDecorationLine: "underline",
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
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#888",
  },
  orText: {
    marginHorizontal: 10,
    color: "#888",
    fontSize: 13,
  },
  socialButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    height: 44,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  socialIcon: {
    marginRight: 10,
  },
  socialText: {
    fontSize: 15,
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
});
