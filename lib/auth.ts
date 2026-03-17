import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebase";

const auth = getAuth(app);

export async function login(email:string, senha:string){
  return await signInWithEmailAndPassword(auth,email,senha);
}

export async function register(email:string, senha:string){
  return await createUserWithEmailAndPassword(auth,email,senha);
}

export { auth };