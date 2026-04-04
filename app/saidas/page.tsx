"use client";

import { useState } from "react";

export default function Saidas(){

  const [categoria,setCategoria] = useState("");
  const [valor,setValor] = useState("");

  const categorias = [
    "Alimentação",
    "Carro",
    "Casa",
    "Lazer",
    "Outros"
  ];

  function salvar(){
    alert("Saída salva!");
    setCategoria("");
    setValor("");
  }

  return(
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] text-white">

      <div className="bg-[#111827] p-8 rounded-xl w-[350px]">

        <h1 className="text-xl mb-4 font-bold">💸 Nova Saída</h1>

        <select
          className="w-full p-2 mb-3 rounded bg-[#0B0F1A] border border-gray-700"
          value={categoria}
          onChange={(e)=>setCategoria(e.target.value)}
        >
          <option value="">Categoria</option>
          {categorias.map(c=>(
            <option key={c}>{c}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Valor"
          className="w-full p-2 mb-4 rounded bg-[#0B0F1A] border border-gray-700"
          value={valor}
          onChange={(e)=>setValor(e.target.value)}
        />

        <button
          onClick={salvar}
          className="w-full bg-red-600 py-2 rounded hover:bg-red-700"
        >
          Salvar
        </button>

      </div>

    </div>
  );
}