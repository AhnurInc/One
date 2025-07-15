// Firebase Configuration for Ahnur Sistema
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;