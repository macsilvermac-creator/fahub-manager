
// @ts-ignore
import { initializeApp } from "firebase/app";
// @ts-ignore
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Note: Analytics is initialized but unused in this version to prioritize core features
import { getAnalytics } from "firebase/analytics";

// Configuração oficial do Projeto (Mesma que aparece no console)
// FIX: Usando a chave específica do Firebase diretamente para evitar conflito com a chave do Gemini (process.env.API_KEY)
const firebaseConfig = {
  apiKey: "AIzaSyB6VDLKBK9Siz81DC_bEm54oMILT-Hd6wA",
  authDomain: "fahub-manager.firebaseapp.com",
  projectId: "fahub-manager",
  storageBucket: "fahub-manager.firebasestorage.app",
  messagingSenderId: "557502201452",
  appId: "1:557502201452:web:fde2bf814beffeb3e12249",
  measurementId: "G-MLRSBH8J6H"
};

const app = initializeApp(firebaseConfig);

// Inicializa serviços vitais
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Inicializa analytics (opcional, não bloqueante)
let analytics;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.warn("Analytics blocked or failed to load (Non-critical)");
  }
}

export default app;