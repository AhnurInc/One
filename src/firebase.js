// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWy5Rrmk-eyk49WFpQrcZNIBFFuQukpR4",
  authDomain: "ahnur-inc.firebaseapp.com",
  projectId: "ahnur-inc",
  storageBucket: "ahnur-inc.firebasestorage.app",
  messagingSenderId: "281444212603",
  appId: "1:281444212603:web:b0e935dc5a651fdef327de"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { auth, db, storage, analytics };
export default app;