import { initializeApp } from "firebase/app";
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

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);