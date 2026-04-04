"use client";

import Link from "next/link";

export default function Home(){

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex flex-col">

      {/* HEADER ROXO */}
      <div className="bg-purple-700 p-6 rounded-b-3xl shadow-lg">

        <h1 className="text-2xl font-bold">
          💰 Financeiro
        </h1>

        <p className="text-purple-200 text-sm">
          Controle seu dinheiro
        </p>

        {/* SALDO (fake por enquanto) */}
        <div className="mt-6">
          <p className="text-purple-200 text-sm">Saldo atual</p>
          <h2 className="text-3xl font-bold">R$ 0,00</h2>
        </div>

      </div>

      {/* CONTEÚDO */}
      <div className="p-6 flex-1">

        {/* BOTÕES */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          <Link href="/entradas">
            <div className="bg-[#111827] p-5 rounded-2xl text-center shadow hover:scale-105 transition">
              <p className="text-green-400 text-xl font-bold">+</p>
              <p className="text-sm text-gray-400 mt-2">Entrada</p>
            </div>
          </Link>

          <Link href="/saidas">
            <div className="bg-[#111827] p-5 rounded-2xl text-center shadow hover:scale-105 transition">
              <p className="text-red-400 text-xl font-bold">-</p>
              <p className="text-sm text-gray-400 mt-2">Saída</p>
            </div>
          </Link>

        </div>

        {/* CARD HISTÓRICO */}
        <div className="bg-[#111827] p-5 rounded-2xl shadow">

          <h3 className="mb-3 text-gray-300">
            Últimas movimentações
          </h3>

          <p className="text-gray-500 text-sm">
            Nenhuma movimentação ainda
          </p>

        </div>

      </div>

    </div>
  );
}