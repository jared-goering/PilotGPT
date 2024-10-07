// src/screens/LoginScreen/LoginScreen.styles.js
import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1, // Ensure the background image covers the whole screen
    justifyContent: "center",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  logoContainer: {
    position: "absolute",
    top: 40, // Adjust padding from the top
    left: 20, // Adjust padding from the right
  },
  logo: {
    width: 220,
    height: 120,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 80, // Adjust margin to position it better on the screen
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,
    color: "#333",
  },
  socialButtonsContainer: {
    marginBottom: 20,
    paddingHorizontal: 24, // Ensure consistent horizontal padding
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center content horizontally
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8, // Changed from 8 to match consistency
    marginBottom: 12,
  },
  googleButton: {
    backgroundColor: "#DB4437", // Google Red
  },
  socialIcon: {
    marginLeft: 16,
    marginRight: 12,
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "500",
  },
  appleButton: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8, // Changed from 8 to match consistency
    marginBottom: 12,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    paddingHorizontal: 24, // Ensure consistent horizontal padding
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 8,
    fontSize: 16,
    color: "#666",
  },
  emailToggleButton: {
    width: "100%",
    paddingVertical: 12,
    marginHorizontal: 30, // Ensure consistent horizontal padding
    borderRadius: 28,
    alignItems: "center",
    marginBottom: 12,
    borderColor: "#8A8A8A",
    borderWidth: 1,
    width: "85%",
  },
  emailToggleText: {
    color: "#676767",
    fontSize: 16,
    fontWeight: "500",
  },
  emailAuthContainer: {
    marginBottom: 24,
    paddingHorizontal: 24, // Ensure consistent horizontal padding
  },
  input: {
    height: 50,
    borderRadius: 28,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#D6D6D6",
  },
  authButton: {
    height: 50,
    backgroundColor: "black", // Green color
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  authButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  toggleAuthButton: {
    alignItems: "center",
    marginBottom: 12,
  },
  toggleAuthText: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
  },
  hideEmailAuthButton: {
    alignItems: "center",
  },
  hideEmailAuthText: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    paddingHorizontal: 24, // Ensure consistent horizontal padding
  },
  signupText: {
    fontSize: 16,
    color: "#666",
  },
  signupLink: {
    fontSize: 16,
    color: "black",
    fontWeight: "500",
  },
});

export default styles;
