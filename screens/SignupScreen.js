// screens/SignupScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { auth } from "../firebaseConfig"; // Correct import

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // For loading state
  const [passwordError, setPasswordError] = useState(""); // For password validation error

  const validatePassword = (pwd) => {
    if (pwd.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const handleSignup = async () => {
    if (!validatePassword(password)) {
      Alert.alert(
        "Invalid Password",
        "Please enter a password with at least 6 characters.",
      );
      return;
    }

    try {
      setLoading(true);
      // Use @react-native-firebase/auth method
      await auth.createUserWithEmailAndPassword(email, password);
      // Navigation is handled by the auth state listener in App.js
    } catch (error) {
      alert(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={[styles.input, passwordError ? styles.inputError : null]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, passwordError ? styles.inputError : null]}
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          validatePassword(text);
        }}
        secureTextEntry
      />
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}
      <Button
        title={loading ? "Signing up..." : "Sign Up"}
        onPress={handleSignup}
        disabled={loading}
      />
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 12,
    textAlign: "left",
  },
  link: {
    color: "blue",
    marginTop: 16,
    textAlign: "center",
  },
});
