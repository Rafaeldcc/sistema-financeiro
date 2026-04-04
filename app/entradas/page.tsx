"use client";

import { useState } from "react";

export default function Entradas(){

  const [categoria,setCategoria] = useState("");
  const [valor,setValor] = useState("");

  const categorias = [
    "Salário",
    "Aluguel",
    "Investimentos",
    "Freelance",
    "Outros"
  ];

  function salvar(){
    alert("Entrada salva!");
    setCategoria("");
    setValor("");
  }

  return(
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A]">

      <div className="bg-[#111827] p-8 rounded-2xl w-[360px] shadow-xl border border-gray-800">

        {/* TÍTULO */}
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          💰 Nova Entrada
        </h1>

        {/* CATEGORIA */}
        <label className="text-sm text-gray-400">
          Categoria
        </label>

        <select
          className="w-full p-3 mb-4 mt-1 rounded-lg bg-[#020617] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          value={categoria}
          onChange={(e)=>setCategoria(e.target.value)}
        >
          <option value="" className="bg-white text-black">
            Selecione
          </option>

          {categorias.map(c=>(
            <option key={c} value={c} className="bg-white text-black">
              {c}
            </option>
          ))}
        </select>

        {/* VALOR */}
        <label className="text-sm text-gray-400">
          Valor
        </label>

        <input
          type="number"
          placeholder="R$ 0,00"
          className="w-full p-3 mb-6 mt-1 rounded-lg bg-[#020617] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={valor}
          onChange={(e)=>setValor(e.target.value)}
        />

        {/* BOTÃO */}
        <button
          onClick={salvar}
          className="w-full bg-green-600 py-3 rounded-lg text-lg font-semibold text-white hover:bg-green-700 transition shadow-md"
        >
          Salvar Entrada
        </button>

      </div>

    </div>
  );
}