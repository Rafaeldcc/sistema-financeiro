"use client";

import Link from "next/link";

export default function Home(){

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B0F1A] to-[#111827] text-white">

      <div className="bg-[#111827] p-10 rounded-2xl shadow-xl w-[350px] text-center">

        <h1 className="text-3xl font-bold mb-6">
          💰 Sistema Financeiro
        </h1>

        <p className="text-gray-400 mb-6">
          Controle suas finanças de forma simples
        </p>

        <div className="flex flex-col gap-4">

          <Link href="/entradas">
            <button className="w-full bg-green-600 py-3 rounded-lg hover:bg-green-700 transition text-lg font-semibold">
              + Entrada
            </button>
          </Link>

          <Link href="/saidas">
            <button className="w-full bg-red-600 py-3 rounded-lg hover:bg-red-700 transition text-lg font-semibold">
              - Saída
            </button>
          </Link>

        </div>

      </div>

    </div>
  );
}