import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { auth } from "../firebaseConfig"; // Correct import

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const userId = "user123"; // You can dynamically generate or retrieve this from user context

  user = auth.currentUser; // Get the current user

  useEffect(() => {
    console.log("User signed in:", user.displayName); // Log when user is signed in
  }, []);

  const userName = user.displayName; // Example user name

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/wave-pattern.png")}
        style={styles.background}
      >
        <View style={styles.headerIcons}>
          <View style={styles.profileContainer}>
            <TouchableOpacity
              onPress={() => {
                /* Add your profile screen navigation here */
              }}
            >
              <Image
                source={require("../assets/profile-icon.png")}
                style={styles.profileIcon}
              />
            </TouchableOpacity>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image
              source={require("../assets/menu-icon.png")}
              style={styles.menuIcon}
            />
          </TouchableOpacity>
        </View>
        <Image
          source={require("../assets/full-logo.png")}
          style={styles.logo}
        />
        <Spinner
          visible={loading}
          textContent={"Loading..."}
          textStyle={styles.spinnerText}
        />
        <View style={styles.questionBox}>
          <Image
            source={require("../assets/chat-icon.png")}
            style={styles.chatIcon}
          />
          <Text style={styles.questionText}>Ask a new question</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
            <View style={styles.chatButton}>
              <Text style={styles.chatButtonText}>Start New Chat</Text>
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  headerIcons: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 30,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 10,
    marginTop: 10,
  },
  profileIcon: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginLeft: -20,
  },
  userName: {
    color: "#000",
    fontSize: 16,
    marginLeft: 10,
    fontFamily: "Inter-Bold", // Use static font for testing
  },
  logo: {
    width: 300,
    height: 100,
    resizeMode: "contain",
    marginBottom: 100,
  },
  questionBox: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "#000",
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: "center",
    marginTop: 20,
  },
  chatIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginBottom: 20,
  },
  questionText: {
    color: "white",
    fontSize: 20,
    marginBottom: 20,
    fontFamily: "Inter-Bold", // Use static font for testing
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#A8E0BC",
    borderRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 40, // Adjust this value to make the button wider
    minWidth: 300, // Add this line to set a minimum width
    justifyContent: "center",
  },
  chatButtonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Inter-Bold", // Use static font for testing
  },
  arrow: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Inter-Bold", // Use static font for testing
    marginLeft: 10,
  },
  spinnerText: {
    color: "#fff",
    fontFamily: "Inter-Regular", // Use static font for testing
  },
});
