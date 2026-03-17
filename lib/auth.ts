import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { app } from "./firebase";

const auth = getAuth(app);

// ===============================
// LOGIN
// ===============================

export async function login(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCredential.user;

  } catch (error: any) {
    console.error("Erro no login:", error.message);
    throw new Error(error.message);
  }
}

// ===============================
// REGISTRO
// ===============================

export async function register(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCredential.user;

  } catch (error: any) {
    console.error("Erro no cadastro:", error.message);
    throw new Error(error.message);
  }
}

// ===============================
// LOGOUT
// ===============================

export async function logout() {
  await signOut(auth);
}

// ===============================
// USUÁRIO ATUAL
// ===============================

export function getUser() {
  return auth.currentUser;
}

// ===============================
// OBSERVAR LOGIN (IMPORTANTE)
// ===============================

export function onAuthChange(callback: any) {
  return onAuthStateChanged(auth, callback);
}

// ===============================

export { auth };