import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

const COLORS = {
  primary: "#007BFF",
  text: "#000",
  background: "#fff",
};

export default function PrivacyPolicyScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.text}>
          {/* Add your privacy policy content here */}
          This Privacy Policy outlines how we collect, use, and protect your information. 
          We are committed to ensuring that your privacy is protected. If we ask you to 
          provide certain information by which you can be identified, it will only be used 
          in accordance with this privacy statement.
        </Text>
        <Text style={styles.text}>
          We may collect the following information: name, contact information including email 
          address, demographic information such as postcode, preferences, and interests.
        </Text>
        <Text style={styles.text}>
          We require this information to understand your needs and provide you with a better 
          service, particularly for the following reasons: internal record keeping, 
          improving our products and services, and sending promotional emails about new 
          products, special offers, or other information which we think you may find 
          interesting using the email address you have provided.
        </Text>
        {/* Add more sections as needed */}
      </ScrollView>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: COLORS.text,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 20,
  },
  backButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "600",
  },
});
