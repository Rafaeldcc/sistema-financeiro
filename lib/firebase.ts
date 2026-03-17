// ===============================
// FIREBASE CONFIG
// ===============================

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDOK3MqXavTRqapug_ASHPbLTSse6IT4d8",
  authDomain: "financeiro-inteligente-50aa1.firebaseapp.com",
  projectId: "financeiro-inteligente-50aa1",
  storageBucket: "financeiro-inteligente-50aa1.firebasestorage.app",
  messagingSenderId: "315301860317",
  appId: "1:315301860317:web:6045ea403414f598d01c34",
};

// 🔥 Evita erro de múltiplas inicializações no Vercel
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

// ✅ EXPORTANDO TUDO CERTO
export { app };

export const auth = getAuth(app);
export const db = getFirestore(app);