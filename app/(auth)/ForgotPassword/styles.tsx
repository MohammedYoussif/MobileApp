import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 24,
  },
  backButton: {
    marginBottom: 24,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    color: "#222",
  },
  subtitle: {
    fontSize: 16,
    color: "#222",
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Cairo-Regular",
  },
  otpButton: {
    width: "100%",
    height: 44,
    backgroundColor: "#B38051",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  otpButtonText: {
    color: "white",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
