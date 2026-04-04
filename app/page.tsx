"use client";

import Link from "next/link";

export default function Home(){

  return (
    <div className="p-6 text-white">

      <h1 className="text-2xl font-bold mb-6">
        Sistema Financeiro
      </h1>

      <div className="flex gap-4">

        <Link href="/entradas">
          <button className="bg-green-600 px-6 py-3 rounded">
            + Entrada
          </button>
        </Link>

        <Link href="/saidas">
          <button className="bg-red-600 px-6 py-3 rounded">
            - Saída
          </button>
        </Link>

      </div>

    </div>
  );
}