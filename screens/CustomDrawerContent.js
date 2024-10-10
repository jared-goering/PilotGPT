import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { auth } from "../firebaseConfig"; // Import Firebase auth
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import Icon from "react-native-vector-icons/MaterialIcons"; // Import the icons
import Superwall from "@superwall/react-native-superwall"

export default function CustomDrawerContent(props) {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the user from Firebase
      navigation.replace("LoginScreen"); // Navigate to the LoginScreen
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const handleSubscribe = async () => {
    try {
        console.log("Subscription flow triggered.");
      // Attempt to show the Superwall paywall
      await Superwall.shared.register("show_paywall");
      console.log("superwall finished")
    } catch (error) {
      console.error("Error triggering Superwall paywall: ", error);
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.menuTitle}>Menu</Text>
        <DrawerItem
          label="Settings"
          onPress={() => {}}
          icon={() => <Icon name="settings" size={24} color="black" />} // Add icon here
        />
        <DrawerItem
          label="Help Center"
          onPress={() => {}}
          icon={() => <Icon name="help-outline" size={24} color="black" />} // Add icon here
        />
        <View style={styles.subscribeContainer}>
          <Text style={styles.subscribeTitle}>Subscribe Now</Text>
          <Text style={styles.subscribeText}>
            Unlock the benefits and elevate your experience with our premium
            subscription.
          </Text>
          <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
            <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Add background color to drawer content
    paddingTop: 50, // Adjust top padding to avoid overlap with status bar
  },
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  menuTitle: {
    fontSize: 24,
    fontFamily: "Inter-Regular",
    marginBottom: 20,
  },
  subscribeContainer: {
    backgroundColor: "#000",
    padding: 20,
    borderRadius: 10,
    marginVertical: 20,
  },
  subscribeTitle: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "Inter-Regular",
    marginBottom: 10,
  },
  subscribeText: {
    color: "#fff",
    fontFamily: "Inter-Regular",
    marginBottom: 20,
  },
  subscribeButton: {
    backgroundColor: "#DCF8C6",
    padding: 10,
    borderRadius: 5,
  },
  subscribeButtonText: {
    textAlign: "center",
    fontFamily: "Inter-Regular",
    color: "#000",
  },
  logoutButton: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButtonText: {
    textAlign: "center",
    color: "#000",
  },
});