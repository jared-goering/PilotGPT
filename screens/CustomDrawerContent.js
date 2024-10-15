
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { auth, firestore } from "../firebaseConfig"; // Ensure firestore is exported from firebaseConfig
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Superwall from "@superwall/react-native-superwall";
import SettingsModal from "../components/SettingsModal"; // Import the SettingsModal component

export default function CustomDrawerContent(props) {
  const [subscriptionStatus, setSubscriptionStatus] = useState(false); // Boolean state
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false); // Controls modal visibility
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch subscription status on component mount
    fetchSubscriptionStatus();
    console.log("fetchSubscriptionStatus called");

    // Event listener for subscription changes
    const handleSubscriptionEvent = (event) => {
      if (event.type === "SUBSCRIPTION_STATUS_CHANGED") {
        const isActive = event.status === "ACTIVE";
        setSubscriptionStatus(isActive);
        console.log("Subscription Status Changed:", event.status);
      }
    };

    // Register the event listener
    // Superwall.shared.onEvent(handleSubscriptionEvent);

    // Clean up the event listener on unmount
    return () => {
      Superwall.shared.offEvent(handleSubscriptionEvent);
    };
  }, []);

  // Function to get subscription status
  const fetchSubscriptionStatus = async () => {
    try {
      const status = await Superwall.shared.getSubscriptionStatus();
      const isActive = status === "ACTIVE";
      setSubscriptionStatus(isActive);
      console.log("Subscription Status:", status);
    } catch (error) {
      console.error("Error fetching subscription status:", error);
      Alert.alert(
        "Subscription Error",
        "Unable to fetch subscription status. Please try again later."
      );
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the user from Firebase
      navigation.replace("LoginScreen"); // Navigate to the LoginScreen
    } catch (error) {
      console.error("Error logging out: ", error);
      Alert.alert("Logout Error", "Unable to log out. Please try again.");
    }
  };

  const handleSubscribe = async () => {
    try {
      console.log("Subscription flow triggered.");
      // Attempt to show the Superwall paywall
      await Superwall.shared.register("show_paywall");
      console.log("Superwall paywall completed.");
    } catch (error) {
      console.error("Error triggering Superwall paywall: ", error);
      Alert.alert(
        "Paywall Error",
        "Unable to display the paywall. Please try again later."
      );
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (user) {
                // Reauthenticate user before deleting
                // Implement reauthentication here if necessary
                Alert.prompt(
                  "Reauthenticate",
                  "Please enter your password to confirm.",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Confirm",
                      onPress: async (password) => {
                        try {
                          const credential = auth.EmailAuthProvider.credential(
                            user.email,
                            password
                          );
                          await user.reauthenticateWithCredential(credential);
                          await user.delete();
                          Alert.alert(
                            "Account Deleted",
                            "Your account has been deleted."
                          );
                          navigation.replace("LoginScreen");
                        } catch (error) {
                          console.error("Error deleting account: ", error);
                          Alert.alert(
                            "Deletion Error",
                            "Unable to delete account. Please ensure your password is correct."
                          );
                        }
                      },
                    },
                  ],
                  "secure-text"
                );
              }
            } catch (error) {
              console.error("Error deleting account: ", error);
              Alert.alert(
                "Deletion Error",
                "Unable to delete account. Please try again later."
              );
            }
          },
        },
      ]
    );
  };

  const handleOpenPrivacyPolicy = () => {
    const url = "https://yourwebsite.com/privacy-policy"; // Replace with your actual URL
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert(
            "Error",
            "Unable to open the Privacy Policy at this time."
          );
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const handleChangeName = async (trimmedName) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = firestore.collection("users").doc(user.uid);
        await userRef.update({ name: trimmedName });
        Alert.alert("Success", "Your name has been updated.");
        setIsSettingsModalVisible(false); // Close modal
      }
    } catch (error) {
      console.error("Error updating name: ", error);
      Alert.alert(
        "Update Error",
        "Unable to update your name. Please try again later."
      );
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
          onPress={() => setIsSettingsModalVisible(true)} // Open modal
          icon={() => <Icon name="settings" size={24} color="black" />}
        />
        <DrawerItem
          label="Help Center"
          onPress={() => {}}
          icon={() => <Icon name="help-outline" size={24} color="black" />}
        />

        {/* Conditionally render the subscription section */}
        {!subscriptionStatus && (
          <View style={styles.subscribeContainer}>
            <Text style={styles.subscribeTitle}>Subscribe Now</Text>
            <Text style={styles.subscribeText}>
              Unlock the benefits and elevate your experience with our premium
              subscription.
            </Text>
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={handleSubscribe}
            >
              <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Modal */}
      <SettingsModal
        isVisible={isSettingsModalVisible}
        onClose={() => setIsSettingsModalVisible(false)}
        onDeleteAccount={handleDeleteAccount}
        onOpenPrivacyPolicy={handleOpenPrivacyPolicy}
        onChangeName={handleChangeName}
      />
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
