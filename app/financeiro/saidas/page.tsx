"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/auth";
import {
addDoc,
collection,
serverTimestamp
} from "firebase/firestore";

export default function Saidas(){

const [categoria,setCategoria] = useState("");
const [descricao,setDescricao] = useState("");
const [valor,setValor] = useState("");

const [parcelado,setParcelado] = useState(false);
const [parcelas,setParcelas] = useState(1);

const [recorrente,setRecorrente] = useState(false);
const [tipoRecorrencia,setTipoRecorrencia] = useState("mensal");

const categoriasSaida = [
"Mercado",
"Gasolina",
"Medicamentos",
"Alimentação",
"Lazer",
"Internet",
"Conta de luz",
"Conta de água",
"Aluguel",
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

// 🔥 PROTEÇÃO
if(!auth.currentUser){
alert("Usuário não está logado");
return;
}

try{

const valorNumero = Number(valor);

/* PARCELADO */

if(parcelado && parcelas > 1){

const valorParcela = valorNumero / parcelas;

for(let i = 0; i < parcelas; i++){

await addDoc(collection(db,"transacoes"),{

tipo:"saida",
categoria,
descricao: `${descricao} (${i+1}/${parcelas})`,
valor:valorParcela,

// 🔥 IMPORTANTE
userId: auth.currentUser.uid,

// 🔥 DATA FUTURA (mantemos Date mesmo)
createdAt: new Date(new Date().setMonth(new Date().getMonth() + i)),

parcelado:true

});

}

}

/* RECORRENTE */

else if(recorrente){

await addDoc(collection(db,"transacoes"),{

tipo:"saida",
categoria,
descricao,
valor:valorNumero,

userId: auth.currentUser.uid,

createdAt:serverTimestamp(),

recorrente:true,
tipoRecorrencia

});

}

/* NORMAL */

else{

await addDoc(collection(db,"transacoes"),{

tipo:"saida",
categoria,
descricao,
valor:valorNumero,

userId: auth.currentUser.uid,

createdAt:serverTimestamp()

});

}

alert("Saída registrada");

setCategoria("");
setDescricao("");
setValor("");
setParcelado(false);
setParcelas(1);
setRecorrente(false);

}catch(e){

console.error(e);
alert("Erro ao salvar saída");

}

}

return(

<div className="max-w-xl">

<h1 className="text-2xl font-bold mb-6">
Registrar Saída
</h1>

<select
className="w-full p-2 mb-3 rounded bg-[#0B0F1A] border border-gray-700"
value={categoria}
onChange={(e)=>setCategoria(e.target.value)}
>
<option value="">Selecione a categoria</option>

{categoriasSaida.map((c)=>(
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
className="w-full p-2 mb-3 rounded bg-[#0B0F1A] border border-gray-700"
placeholder="Valor"
value={valor}
onChange={(e)=>setValor(e.target.value)}
/>

{/* PARCELADO */}

<div className="mb-3">
<label className="flex items-center gap-2 text-gray-300">
<input
type="checkbox"
checked={parcelado}
onChange={(e)=>setParcelado(e.target.checked)}
/>
Compra parcelada
</label>
</div>

{parcelado && (
<input
type="number"
className="w-full p-2 mb-3 rounded bg-[#0B0F1A] border border-gray-700"
placeholder="Número de parcelas"
value={parcelas}
onChange={(e)=>setParcelas(Number(e.target.value))}
/>
)}

{/* RECORRENTE */}

<div className="mb-3">
<label className="flex items-center gap-2 text-gray-300">
<input
type="checkbox"
checked={recorrente}
onChange={(e)=>setRecorrente(e.target.checked)}
/>
Cobrança recorrente
</label>
</div>

{recorrente && (
<select
className="w-full p-2 mb-4 rounded bg-[#0B0F1A] border border-gray-700"
value={tipoRecorrencia}
onChange={(e)=>setTipoRecorrencia(e.target.value)}
>
<option value="mensal">Mensal</option>
<option value="semanal">Semanal</option>
<option value="anual">Anual</option>
</select>
)}

<button
onClick={salvar}
className="bg-red-600 px-5 py-2 rounded hover:bg-red-700 transition"
>
Salvar Saída
</button>

</div>

);

}