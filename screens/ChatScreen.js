import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Alert,
} from "react-native";
import axios from "axios";
import Markdown from "react-native-markdown-display";
import { styles, markdownStyles } from "./ChatScreenStyles";
import auth from "@react-native-firebase/auth";
import firestore from '@react-native-firebase/firestore';
import Superwall from "@superwall/react-native-superwall"; // Ensure Superwall is imported

export default function ChatScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState([]);
  const [threadId, setThreadId] = useState(null);
  const [loading, setLoading] = useState(false);

  const scrollViewRef = useRef();

  const QUESTION_LIMIT = 2; // Define your question limit here

  const handleQuery = async () => {
    console.log("handleQuery triggered");

    if (!query.trim()) {
      Alert.alert("Input Required", "Please enter a question.");
      return;
    }

    const user = auth().currentUser;
    if (!user) {
      console.log("User not authenticated");
      Alert.alert("Authentication Required", "Please log in to continue.");
      navigation.replace("Login");
      return;
    }

    const userRef = firestore().collection("users").doc(user.uid);
    console.log("User reference obtained");

    try {
      const userDoc = await userRef.get();
      console.log("User document fetched:", userDoc.exists);
      const now = firestore.Timestamp.now();

      let questionCount = 0;
      let weekStart = now;

      if (userDoc.exists) {
        const data = userDoc.data();
        weekStart = data.weekStart;
        questionCount = data.questionCount;

        console.log("Current questionCount:", questionCount);
        console.log("Current weekStart:", weekStart.toDate());

        // Check if the week has reset
        const weekAgo = firestore.Timestamp.fromDate(
          new Date(now.toDate().getTime() - 7 * 24 * 60 * 60 * 1000)
        );

        if (weekStart.toDate() < weekAgo.toDate()) {
          console.log("Week has reset. Resetting questionCount.");
          // Reset the count
          questionCount = 0;
          weekStart = now;
        }
      }

      if (questionCount >= QUESTION_LIMIT) {
        console.log("Question limit reached. Initiating paywall.");

        // Register the 'send_query' event with Superwall
        Superwall.shared
          .register("show_paywall") // Event name as defined in Superwall dashboard
          .then(() => {
            console.log("User passed the paywall. Proceeding to send query.");

            // Optionally, reset question count or handle accordingly
            // For example, resetting count after subscription
            // questionCount = 0;

            sendQuery(user, userRef, questionCount, weekStart);
          })
          .catch((error) => {
            console.error("Superwall registration error:", error);
            Alert.alert(
              "Paywall Error",
              "Unable to display the paywall. Please try again later."
            );
          });

        return; // Exit the function; query will be sent in the 'then' block if allowed
      } else {
        // Increment the question count and proceed to send the query
        questionCount += 1;
        console.log("Incrementing questionCount to:", questionCount);
        await userRef.set({ questionCount, weekStart }, { merge: true });

        sendQuery(user, userRef, questionCount, weekStart);
      }
    } catch (error) {
      console.error("Error accessing Firestore:", error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    }
  };

  // Function to send the query to the backend
  const sendQuery = async (user, userRef, questionCount, weekStart) => {
    const userMessage = { role: "user", content: query };
    const thinkingMessage = { role: "assistant", content: "..." };

    setConversation((prevConversation) => [
      ...prevConversation,
      userMessage,
      thinkingMessage,
    ]);
    setQuery("");
    setLoading(true);
    console.log("Sending query to backend");

    try {
      const idToken = await user.getIdToken();
      console.log("Obtained ID token");

      const response = await axios.post(
        "https://us-central1-pilotai-4f314.cloudfunctions.net/query",
        { query, threadId },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      console.log("Received response from backend:", response.data);

      const newMessage = {
        role: "assistant",
        content: response.data.answer,
      };

      // Remove the thinking message and add the actual response
      setConversation((prevConversation) => {
        const updatedConversation = [...prevConversation];
        updatedConversation.pop(); // Remove the thinking message
        return [...updatedConversation, newMessage];
      });

      setThreadId(response.data.threadId); // Save the thread ID
    } catch (error) {
      console.error("Error querying backend:", error);
      Alert.alert("Query Error", "There was an error processing your request.");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [conversation]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <ImageBackground
          source={require("../assets/wave.png")}
          style={styles.headerWave}
        />
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require("../assets/back-icon.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.title}>PilotAI</Text>
        </View>
      </View>
      <View style={styles.chatContainer}>
        <ScrollView
          style={styles.conversationContainer}
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {conversation.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                msg.role === "user"
                  ? styles.userMessage
                  : styles.assistantMessage,
              ]}
            >
              <Text style={styles.messageRole}>
                {msg.role === "user" ? "You" : "Assistant"}:
              </Text>
              {msg.content === "..." ? (
                <View style={styles.thinkingContainer}>
                  <ActivityIndicator size="small" color="#0000ff" />
                  <Text style={styles.messageContent}>
                    Assistant is thinking...
                  </Text>
                </View>
              ) : msg.role === "assistant" ? (
                <Markdown style={markdownStyles}>{msg.content}</Markdown>
              ) : (
                <Text style={styles.messageContent}>{msg.content}</Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Send a message..."
          value={query}
          onChangeText={setQuery}
          editable={!loading} // Disable input while loading
        />
        <TouchableOpacity
          onPress={handleQuery}
          style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Image
              source={require("../assets/send-icon.png")}
              style={styles.sendIcon}
            />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}