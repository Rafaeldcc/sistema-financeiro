"use client";

import { useState } from "react";

export default function Categorias(){

  const [tipo,setTipo] = useState<"despesas" | "receitas">("despesas");

  const despesas = [
    { nome:"Alimentação", cor:"bg-pink-400" },
    { nome:"Assinaturas e serviços", cor:"bg-purple-400" },
    { nome:"Bares e restaurantes", cor:"bg-indigo-400" },
    { nome:"Casa", cor:"bg-blue-400" },
    { nome:"Compras", cor:"bg-rose-400" },
    { nome:"Cuidados pessoais", cor:"bg-orange-400" },
    { nome:"Dívidas e empréstimos", cor:"bg-yellow-400" }
  ];

  const receitas = [
    { nome:"Salário", cor:"bg-green-400" },
    { nome:"Investimentos", cor:"bg-emerald-400" },
    { nome:"Empréstimos", cor:"bg-teal-400" },
    { nome:"Outras receitas", cor:"bg-gray-400" }
  ];

  const lista = tipo === "despesas" ? despesas : receitas;

  return(
    <div className="min-h-screen bg-gradient-to-b from-[#0B0F1A] to-[#05070F] text-white flex flex-col">

      {/* HEADER */}
      <div className="p-5 flex items-center justify-between">
        <span className="text-xl">←</span>
        <h1 className="text-lg font-medium">Categorias</h1>
        <div className="flex gap-4 text-lg">
          🔍 ➕
        </div>
      </div>

      {/* TABS */}
      <div className="px-5 mb-4">
        <div className="bg-[#1A1F2E] rounded-full p-1 flex">

          <button
            onClick={()=>setTipo("despesas")}
            className={`flex-1 py-2 rounded-full text-sm transition ${
              tipo==="despesas"
              ? "bg-[#2A2F3F] text-red-400"
              : "text-gray-400"
            }`}
          >
            Despesas
          </button>

          <button
            onClick={()=>setTipo("receitas")}
            className={`flex-1 py-2 rounded-full text-sm transition ${
              tipo==="receitas"
              ? "bg-[#2A2F3F] text-green-400"
              : "text-gray-400"
            }`}
          >
            Receitas
          </button>

        </div>
      </div>

      {/* LISTA */}
      <div className="flex-1 px-5">

        {lista.map((item,i)=>(
          <div
            key={i}
            className="flex items-center gap-4 py-4 border-b border-white/5"
          >

            {/* ÍCONE */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.cor}`}>
              <span className="text-white text-sm">●</span>
            </div>

            {/* TEXTO */}
            <p className="text-gray-200 text-sm">
              {item.nome}
            </p>

          </div>
        ))}

      </div>

      {/* BOTÃO FIXO */}
      <div className="p-5">
        <button className="w-full bg-green-600 py-3 rounded-xl text-base font-medium hover:bg-green-700 transition">
          + Criar categoria
        </button>
      </div>

    </div>
  );
}