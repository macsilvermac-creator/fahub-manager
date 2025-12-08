
// @ts-ignore
import { initializeApp } from "firebase/app";
// @ts-ignore
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração duplicada do antigo firebaseConfig para resolver erro de importação
const firebaseConfig = {
  apiKey: process.env.API_KEY || "AIzaSyB6VDLKBK9Siz81DC_bEm54oMILT-Hd6wA", // Fallback seguro
  authDomain: "fahub-manager.firebaseapp.com",
  projectId: "fahub-manager",
  storageBucket: "fahub-manager.firebasestorage.app",
  messagingSenderId: "557502201452",
  appId: "1:557502201452:web:fde2bf814beffeb3e12249",
  measurementId: "G-MLRSBH8J6H"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
