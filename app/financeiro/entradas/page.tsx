"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/auth"; // ✅ CORRETO AQUI
import {
  addDoc,
  collection,
  serverTimestamp
} from "firebase/firestore";

export default function Entradas(){

const [categoria,setCategoria] = useState("");
const [descricao,setDescricao] = useState("");
const [valor,setValor] = useState("");

const categoriasEntrada = [
"Salário",
"Extra",
"Investimentos",
"Freelance",
"Venda",
"Outros"
];

async function salvar(){

if(!valor){
alert("Digite o valor");
return;
}

if(!categoria){
alert("Selecione a categoria");
return;
}

// 🔥 VERIFICA SE ESTÁ LOGADO
if(!auth.currentUser){
alert("Usuário não está logado");
return;
}

try{

await addDoc(collection(db,"transacoes"),{
  tipo:"entrada", // ✅ CORRIGIDO
  valor:Number(valor),
  categoria,
  descricao,
  userId: auth.currentUser.uid,
  createdAt: serverTimestamp()
});

alert("Entrada registrada");

setCategoria("");
setDescricao("");
setValor("");

}catch(e){

console.error(e);
alert("Erro ao salvar entrada");

}

}

return(

<div className="max-w-xl">

<h1 className="text-2xl font-bold mb-6">
Registrar Entrada
</h1>

<select
className="w-full p-2 mb-3 rounded bg-[#0B0F1A] border border-gray-700"
value={categoria}
onChange={(e)=>setCategoria(e.target.value)}
>

<option value="">Selecione a categoria</option>

{categoriasEntrada.map((c)=>(
<option key={c} value={c}>
{c}
</option>
))}

</select>

<input
className="w-full p-2 mb-3 rounded bg-[#0B0F1A] border border-gray-700"
placeholder="Descrição"
value={descricao}
onChange={(e)=>setDescricao(e.target.value)}
/>

<input
type="number"
className="w-full p-2 mb-4 rounded bg-[#0B0F1A] border border-gray-700"
placeholder="Valor"
value={valor}
onChange={(e)=>setValor(e.target.value)}
/>

<button
onClick={salvar}
className="bg-green-600 px-5 py-2 rounded hover:bg-green-700 transition"
>
Salvar Entrada
</button>

</div>

);

}