import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Configuração do Firebase do projeto Ahnur-Inc
const firebaseConfig = {
  apiKey: "AIzaSyAWy5Rrmk-eyk49WFpQrcZNIBFFuQukpR4",
  authDomain: "ahnur-inc.firebaseapp.com",
  projectId: "ahnur-inc",
  storageBucket: "ahnur-inc.firebasestorage.app",
  messagingSenderId: "281444212603",
  appId: "1:281444212603:web:b0e935dc5a651fdef327de"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar serviços do Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);