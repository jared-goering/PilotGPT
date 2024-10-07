// screens/LoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  ImageBackground,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { AppleButton } from "@invertase/react-native-apple-authentication";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import Icon from "react-native-vector-icons/Ionicons"; // For adding icons to buttons
import styles from "./LoginScreen.styles"; // Import styles

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmailSignIn, setIsEmailSignIn] = useState(false); // Toggle for Email Sign-In
  const [isEmailAuth, setIsEmailAuth] = useState(false); // Toggle for Email Auth (Login/Sign Up)
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Sign Up

  // Configure Google Sign-In
  // Configure Google Sign-In
  GoogleSignin.configure({
    webClientId:
      "221306822742-etta0623anfb0cpnfjvuo2809q9sjjlb.apps.googleusercontent.com",
  });

  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      const { idToken } = userInfo.data;

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential);

      // Navigate to Main screen
      navigation.replace("Main");
    } catch (error) {
      let errorMessage =
        "An error occurred during Google Sign-In. Please try again.";
      console.error("Error during Google sign-in:", error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the sign-in process
        errorMessage = "Google Sign-In was cancelled.";
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // Sign-in is in progress already
        errorMessage = "Google Sign-In is already in progress.";
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // Play services not available or outdated
        errorMessage = "Google Play Services is not available or outdated.";
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
        // Account exists with different credential
        errorMessage =
          "An account already exists with the same email address but different sign-in credentials. Please use a different sign-in method.";
      } else if (error.code === "auth/invalid-credential") {
        // Invalid credential
        errorMessage = "The credential is invalid or has expired.";
      }

      Alert.alert("Google Sign-In Error", errorMessage, [{ text: "OK" }], {
        cancelable: false,
      });
    }
  }

  const onAppleButtonPress = async () => {
    try {
      setLoading(true);
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      if (!appleAuthRequestResponse.identityToken) {
        throw new Error("Apple Sign-In failed - no identity token returned");
      }

      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );

      await auth().signInWithCredential(appleCredential);

      navigation.replace("Main");
    } catch (error) {
      let errorMessage =
        "An error occurred during Apple Sign-In. Please try again.";
      console.error("Apple Sign-In Error:", error);

      if (error.code === appleAuth.Error.CANCELED) {
        errorMessage = "Apple Sign-In was cancelled.";
      } else if (error.code === appleAuth.Error.UNKNOWN) {
        errorMessage = "An unknown error occurred. Please try again.";
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
        errorMessage =
          "An account already exists with the same email address but different sign-in credentials. Please use a different sign-in method.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "The credential is invalid or has expired.";
      }

      Alert.alert("Apple Sign-In Error", errorMessage, [{ text: "OK" }], {
        cancelable: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Input Error", "Please enter both email and password.");
      return;
    }

    // Simple email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      if (isSignUp) {
        // Handle Sign Up
        await auth().createUserWithEmailAndPassword(email, password);
        Alert.alert("Success", "Account created successfully!");
      } else {
        // Handle Login
        await auth().signInWithEmailAndPassword(email, password);
      }
      navigation.replace("Main");
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      console.error(isSignUp ? "Sign Up Error:" : "Login Error:", error);

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email address is already in use.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "The email address is invalid.";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "The password is too weak. Please choose a stronger password.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many attempts. Please try again later.";
      }

      Alert.alert(
        isSignUp ? "Sign Up Error" : "Login Error",
        errorMessage,
        [{ text: "OK" }],
        { cancelable: false },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <ImageBackground
        source={require("../assets/wave-background.png")} // Ensure correct image path
        style={styles.backgroundImage}
        resizeMode="cover" // Ensure the background covers the screen
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.container}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/full-logo.png")} // Adjust logo path
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Title */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>Ask Flight-Related Questions</Text>
              <Text style={styles.subtitle}>
                Our custom AI is trained on the latest FAA publications and
                recommendations.
              </Text>
            </View>

            {/* Social Sign-In Buttons */}
            <View style={styles.socialButtonsContainer}>
              {/* Google Sign-In */}
              <TouchableOpacity
                style={[styles.socialButton, styles.googleButton]}
                onPress={onGoogleButtonPress}
                disabled={loading}
                accessibilityLabel="Continue with Google"
                accessible={true}
              >
                <Icon
                  name="logo-google"
                  size={20}
                  color="#fff"
                  style={styles.socialIcon}
                />
                <Text style={styles.socialButtonText}>
                  Continue with Google
                </Text>
              </TouchableOpacity>

              {/* Apple Sign-In */}
              {Platform.OS === "ios" && (
                <AppleButton
                  buttonStyle={AppleButton.Style.BLACK}
                  buttonType={AppleButton.Type.SIGN_IN}
                  style={styles.appleButton}
                  onPress={onAppleButtonPress}
                  disabled={loading}
                  accessibilityLabel="Continue with Apple"
                  accessible={true}
                />
              )}
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Toggle Email Auth */}
            {!isEmailAuth ? (
              <TouchableOpacity
                style={styles.emailToggleButton}
                onPress={() => setIsEmailAuth(true)}
                disabled={loading}
                accessibilityLabel="Sign in with Email"
                accessible={true}
              >
                <Text style={styles.emailToggleText}>Sign in with Email</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.emailAuthContainer}>
                {/* Email and Password Inputs */}
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#666"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor="#666"
                />

                {/* Dynamic Login/Sign Up Button */}
                <TouchableOpacity
                  style={styles.authButton}
                  onPress={handleAuth}
                  disabled={loading}
                  accessibilityLabel={isSignUp ? "Sign Up" : "Login"}
                  accessible={true}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.authButtonText}>
                      {isSignUp ? "Sign Up" : "Login"}
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Toggle between Login and Sign Up */}
                <TouchableOpacity
                  style={styles.toggleAuthButton}
                  onPress={() => setIsSignUp(!isSignUp)}
                  disabled={loading}
                  accessibilityLabel={
                    isSignUp ? "Switch to Login" : "Switch to Sign Up"
                  }
                  accessible={true}
                >
                  <Text style={styles.toggleAuthText}>
                    {isSignUp
                      ? "Already have an account? Login"
                      : "Don't have an account? Sign Up"}
                  </Text>
                </TouchableOpacity>

                {/* Hide Email Auth Button */}
                <TouchableOpacity
                  style={styles.hideEmailAuthButton}
                  onPress={() => {
                    setIsEmailAuth(false);
                    setIsSignUp(false);
                    setEmail("");
                    setPassword("");
                  }}
                  disabled={loading}
                  accessibilityLabel="Back to Social Sign-In"
                  accessible={true}
                >
                  <Text style={styles.hideEmailAuthText}>
                    Back to Social Sign-In
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
