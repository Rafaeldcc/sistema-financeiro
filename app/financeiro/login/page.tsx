"use client";

import { auth } from "@/lib/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Login(){

  const router = useRouter();

  async function loginGoogle(){
    try{
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      router.push("/financeiro/dashboard");

    }catch(e){
      console.error(e);
      alert("Erro ao fazer login");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen text-white">
      <div className="bg-[#111827] p-8 rounded-xl text-center">

        <h1 className="text-2xl mb-4">Login</h1>
        <p className="mb-4">Faça login para continuar</p>

        <button
          onClick={loginGoogle}
          className="bg-purple-600 px-6 py-2 rounded hover:bg-purple-700"
        >
          Entrar com Google
        </button>

      </div>
    </div>
  );
}