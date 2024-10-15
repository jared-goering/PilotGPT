// App.js
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import HomeScreen from "./screens/HomeScreen";
import ChatScreen from "./screens/ChatScreen";
import CustomDrawerContent from "./screens/CustomDrawerContent";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import PrivacyPolicyScreen from "./screens/PrivacyPolicyScreen";
import SettingsModal from "./components/SettingsModal";
import { auth } from "./firebaseConfig"; // Correct import
import Constants from "expo-constants";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Superwall from "@superwall/react-native-superwall"
import { Platform } from "react-native"


// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const fetchFonts = () => {
  return Font.loadAsync({
    "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
    "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
  });
};

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: "slide",
        drawerPosition: "right",
        overlayColor: "rgba(0, 0, 0, 0.5)", // Add an overlay color
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Chat"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadFonts = async () => {
      await fetchFonts();
      console.log("Fonts loaded");
      setFontLoaded(true);
      SplashScreen.hideAsync();
    };

    loadFonts();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User signed in:", user.email); // Log when user is signed in
      } else {
        console.log("No user signed in"); // Log when user is signed out
      }
      setUser(user); // Update the user state
    });

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, []);

  useEffect(() => {
    const apiKey = Platform.OS === "ios" ? "pk_1bd834501bf2e5a76dcf2664806f45eacc1547fb2f03175d" : "MY_ANDROID_API_KEY"

    Superwall.configure(apiKey)
    console.log("Superwall configured")
  }, []);

  // useEffect(() => {
  //     const unsubscribe = auth().onAuthStateChanged((currentUser) => {
  //       console.log("onAuthStateChanged: user:", currentUser);
  //       setUser(currentUser || null);
  //       setLoadingUser(false);
  //     });

  //     return () => unsubscribe();
  //   }, []);

  if (!fontLoaded) {
    return null;
  }

  // // Inside your App component or a separate configuration file
  // useEffect(() => {
  //     GoogleSignin.configure({
  //     webClientId: Constants.manifest.extra.googleWebClientId, // From app.config.js
  //     offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  //     });
  // }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={DrawerNavigator} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
            <Stack.Screen name="SettingsModal" component={SettingsModal} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
