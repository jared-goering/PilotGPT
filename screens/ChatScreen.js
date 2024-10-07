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
} from "react-native";
import axios from "axios";
import Markdown from "react-native-markdown-display";
import { styles, markdownStyles } from "./ChatScreenStyles";
import auth from "@react-native-firebase/auth";

export default function ChatScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState([]);
  const [threadId, setThreadId] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();
  const userId = "user123";

  const handleQuery = async () => {
    if (!query.trim()) {
      alert("Please enter a question.");
      return;
    }

    const userMessage = { role: "user", content: query };
    const thinkingMessage = { role: "assistant", content: "..." };

    setConversation((prevConversation) => [
      ...prevConversation,
      userMessage,
      thinkingMessage,
    ]);
    setQuery("");
    setLoading(true);

    try {
      const user = auth().currentUser;
      const idToken = await user.getIdToken();

      const response = await axios.post(
        "https://us-central1-pilotai-4f314.cloudfunctions.net/query",
        { query, threadId },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      );

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
      console.error("Error querying documents:", error);
      alert("Error querying documents");
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
        />
        <TouchableOpacity onPress={handleQuery} style={styles.sendButton}>
          <Image
            source={require("../assets/send-icon.png")}
            style={styles.sendIcon}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
