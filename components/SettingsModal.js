import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { auth, firestore } from "../firebaseConfig"; // Ensure firestore is exported from firebaseConfig
import { useNavigation } from "@react-navigation/native";

const COLORS = {
  primary: "#007BFF",
  secondary: "#E1EEEF",
  text: "#000",
  background: "#fff",
  danger: "#000",
  gray: "#F4F4F4",
  black: "#000",
  highlight: "#ADE6BB",
};

export default function SettingsModal({
  isVisible,
  onClose,
  onDeleteAccount,
  onChangeName,
}) {
  const [newName, setNewName] = useState("");
  const [showChangeNameInput, setShowChangeNameInput] = useState(false);

    const navigation = useNavigation(); 

  const handleUpdateName = () => {
    if (!newName.trim()) {
      Alert.alert("Invalid Input", "Please enter a valid name.");
      return;
    }
    onChangeName(newName.trim());
    setNewName("");
    setShowChangeNameInput(false);
  };

  const handleOpenPrivacyPolicy = () => {
    navigation.navigate("PrivacyPolicy"); 
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Close button as an "X" in the top-right corner */}
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Text style={styles.closeIconText}>×</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Settings</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.pillButton,
                showChangeNameInput ? styles.activePillButton : styles.highlightButton,
              ]}
              onPress={() => setShowChangeNameInput(!showChangeNameInput)}
            >
              <Text
                style={[
                  styles.pillButtonText,
                  showChangeNameInput && styles.activePillButtonText,
                ]}
              >
                Change Name
              </Text>
            </TouchableOpacity>

            {showChangeNameInput && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter new name"
                  value={newName}
                  onChangeText={setNewName}
                />
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={handleUpdateName}
                >
                  <Text style={styles.updateButtonText}>Update Name</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={[styles.pillButton, styles.blackButton]}
              onPress={handleOpenPrivacyPolicy}
            >
              <Text style={[styles.pillButtonText, styles.blackButtonText]}>
                Privacy Policy & Terms
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pillButton, styles.dangerButton]}
              onPress={onDeleteAccount}
            >
              <Text style={[styles.pillButtonText, styles.dangerButtonText]}>
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    position: "relative", // To position the close button relative to the container
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: COLORS.gray,
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIconText: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: COLORS.text,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  pillButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 5,
    alignItems: "center",
  },
  highlightButton: {
    backgroundColor: COLORS.highlight,
  },
  blackButton: {
    backgroundColor: COLORS.black,
  },
  dangerButton: {
    backgroundColor: COLORS.gray,
  },
  pillButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  activePillButtonText: {
    color: COLORS.text,
  },
  blackButtonText: {
    color: COLORS.background,
  },
  dangerButtonText: {
    color: COLORS.danger,
  },
  inputContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    padding: 10,
    paddingLeft: 20,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  updateButton: {
    backgroundColor: COLORS.highlight,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
  },
  updateButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
});

