// firebaseConfig.js
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

// Initialize Firebase services
const firebaseAuth = auth();
const firebaseFirestore = firestore();
const firebaseStorage = storage();

console.log("Firestore Instance:", firebaseFirestore);

export {
  firebaseAuth as auth,
  firebaseFirestore as firestore,
  firebaseStorage as storage,
};
