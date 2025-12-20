
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6VDLKBK9Siz81DC_bEm54oMILT-Hd6wA", // Chave de demonstração/teste
  authDomain: "fahub-manager.firebaseapp.com",
  projectId: "fahub-manager",
  storageBucket: "fahub-manager.firebasestorage.app",
  messagingSenderId: "557502201452",
  appId: "1:557502201452:web:fde2bf814beffeb3e12249"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export default app;
