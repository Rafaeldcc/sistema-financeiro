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
    const dados = {
      tipo:"saida",
      categoria,
      valor:Number(valor)
    };

    console.log("SALVANDO:", dados);

    alert("Saída salva!");
    setCategoria("");
    setValor("");
  }

  return(
    <div className="p-6 text-white">

      <h1 className="text-2xl mb-4">Saída</h1>

      <select
        className="w-full p-2 mb-3 bg-black border"
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
        className="w-full p-2 mb-3 bg-black border"
        value={valor}
        onChange={(e)=>setValor(e.target.value)}
      />

      <button
        onClick={salvar}
        className="bg-red-600 px-6 py-2 rounded"
      >
        Salvar Saída
      </button>

    </div>
  );
}