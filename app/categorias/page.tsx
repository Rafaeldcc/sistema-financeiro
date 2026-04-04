"use client";

import { useState } from "react";

export default function Categorias(){

  const [tipo,setTipo] = useState<"despesas" | "receitas">("despesas");

  const despesas = [
    { nome:"Alimentação", cor:"bg-pink-500" },
    { nome:"Assinaturas", cor:"bg-purple-500" },
    { nome:"Restaurantes", cor:"bg-indigo-500" },
    { nome:"Casa", cor:"bg-blue-500" },
    { nome:"Compras", cor:"bg-red-500" },
    { nome:"Pessoal", cor:"bg-orange-500" },
    { nome:"Dívidas", cor:"bg-yellow-500" }
  ];

  const receitas = [
    { nome:"Salário", cor:"bg-green-500" },
    { nome:"Investimentos", cor:"bg-emerald-500" },
    { nome:"Empréstimos", cor:"bg-teal-500" },
    { nome:"Outros", cor:"bg-gray-500" }
  ];

  const lista = tipo === "despesas" ? despesas : receitas;

  return(
    <div className="min-h-screen bg-[#0B0F1A] text-white flex flex-col">

      {/* HEADER */}
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Categorias</h1>
        <div className="flex gap-4 text-xl">
          🔍 ➕
        </div>
      </div>

      {/* TABS */}
      <div className="px-4 mb-4">
        <div className="bg-[#111827] rounded-full flex p-1">

          <button
            onClick={()=>setTipo("despesas")}
            className={`flex-1 py-2 rounded-full text-sm ${
              tipo==="despesas"
              ? "bg-red-500 text-white"
              : "text-gray-400"
            }`}
          >
            Despesas
          </button>

          <button
            onClick={()=>setTipo("receitas")}
            className={`flex-1 py-2 rounded-full text-sm ${
              tipo==="receitas"
              ? "bg-green-500 text-white"
              : "text-gray-400"
            }`}
          >
            Receitas
          </button>

        </div>
      </div>

      {/* LISTA */}
      <div className="flex-1 px-4 space-y-4">

        {lista.map((item,i)=>(
          <div key={i} className="flex items-center gap-4 border-b border-gray-800 pb-4">

            {/* ÍCONE */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.cor}`}>
              💰
            </div>

            {/* TEXTO */}
            <p className="text-gray-200">
              {item.nome}
            </p>

          </div>
        ))}

      </div>

      {/* BOTÃO FIXO */}
      <div className="p-4">
        <button className="w-full bg-green-600 py-3 rounded-xl text-lg font-semibold hover:bg-green-700">
          + Criar categoria
        </button>
      </div>

    </div>
  );
}