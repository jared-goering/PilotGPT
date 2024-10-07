import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    height: 175,
    backgroundColor: "#000",
  },
  headerWave: {
    position: "absolute",
    top: 30, // Adjust to move the wave down
    left: 0,
    right: 0,
    height: 200, // Adjust to fit the wave image
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20, // Adjust padding to move the content down within the header
    paddingHorizontal: 10,
    height: "100%", // Ensure the content spans the full height
  },
  title: {
    fontSize: 26,
    color: "#fff",
    fontFamily: "Inter-Bold", // Use static font for testing
    textAlign: "center",
    flex: 1,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  conversationContainer: {
    flex: 1,
    paddingHorizontal: 20, // Add padding to the sides
  },
  messageContainer: {
    marginBottom: 10,
    maxWidth: "80%",
    borderRadius: 20,
    padding: 10,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#EAEAEA",
  },
  messageRole: {
    fontWeight: "bold",
  },
  messageContent: {
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  sendButton: {
    marginLeft: 10,
  },
  sendIcon: {
    width: 24,
    height: 24,
  },
  thinkingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export const markdownStyles = {
  paragraph: {
    marginBottom: 5,
    marginTop: 5,
  },
  heading1: {
    marginBottom: 5,
    marginTop: 5,
  },
  heading2: {
    marginBottom: 5,
    marginTop: 5,
  },
  heading3: {
    marginBottom: 5,
    marginTop: 5,
  },
  heading4: {
    marginBottom: 5,
    marginTop: 5,
  },
  heading5: {
    marginBottom: 5,
    marginTop: 5,
  },
  heading6: {
    marginBottom: 5,
    marginTop: 5,
  },
  listItem: {
    marginBottom: 5,
    marginTop: 5,
  },
  blockquote: {
    marginBottom: 5,
    marginTop: 5,
  },
};
