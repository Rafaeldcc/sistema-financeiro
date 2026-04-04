"use client";

import Link from "next/link";

export default function Home(){

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] to-[#111827] text-white flex items-center justify-center">

      <div className="w-full max-w-md px-6">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">
            💰 Financeiro
          </h1>
          <p className="text-gray-400">
            Controle seu dinheiro de forma inteligente
          </p>
        </div>

        {/* CARD PRINCIPAL */}
        <div className="bg-[#111827] rounded-2xl p-6 shadow-lg border border-gray-800">

          <h2 className="text-lg mb-4 text-gray-300">
            Ações rápidas
          </h2>

          <div className="flex flex-col gap-4">

            <Link href="/entradas">
              <button className="w-full bg-green-600 py-3 rounded-xl text-lg font-semibold hover:bg-green-700 transition shadow-md">
                + Nova Entrada
              </button>
            </Link>

            <Link href="/saidas">
              <button className="w-full bg-red-600 py-3 rounded-xl text-lg font-semibold hover:bg-red-700 transition shadow-md">
                - Nova Saída
              </button>
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}