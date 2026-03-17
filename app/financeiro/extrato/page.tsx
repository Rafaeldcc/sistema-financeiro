"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
collection,
getDocs,
query,
orderBy,
deleteDoc,
doc,
updateDoc
} from "firebase/firestore";

export default function Extrato(){

const [movimentacoes,setMovimentacoes] = useState<any[]>([]);
const [editarId,setEditarId] = useState<string | null>(null);

const [categoria,setCategoria] = useState("");
const [descricao,setDescricao] = useState("");
const [valor,setValor] = useState("");

const [mes,setMes] = useState("");
const [categoriaFiltro,setCategoriaFiltro] = useState("");

useEffect(()=>{
carregar();
},[]);

async function carregar(){

const q = query(
collection(db,"transacoes"),
orderBy("createdAt","desc")
);

const snapshot = await getDocs(q);

const lista:any[] = [];

snapshot.forEach((docItem)=>{

lista.push({
id:docItem.id,
...docItem.data()
});

});

setMovimentacoes(lista);

}

async function excluir(id:string){

const confirmar = confirm("Deseja excluir essa movimentação?");

if(!confirmar) return;

await deleteDoc(doc(db,"transacoes",id));

setMovimentacoes(
movimentacoes.filter((mov)=>mov.id !== id)
);

}

function editar(mov:any){

setEditarId(mov.id);
setCategoria(mov.categoria);
setDescricao(mov.descricao);
setValor(mov.valor);

}

async function salvarEdicao(){

if(!editarId) return;

await updateDoc(
doc(db,"transacoes",editarId),
{
categoria,
descricao,
valor:Number(valor)
}
);

setEditarId(null);

carregar();

}

function formatarData(timestamp:any){

if(!timestamp) return "";

const data = timestamp.toDate();

return data.toLocaleString("pt-BR");

}

const meses = [
"Janeiro",
"Fevereiro",
"Março",
"Abril",
"Maio",
"Junho",
"Julho",
"Agosto",
"Setembro",
"Outubro",
"Novembro",
"Dezembro"
];

return(

<div>

<h1 className="text-2xl font-bold mb-8">
Extrato Financeiro
</h1>

{/* FILTROS */}

<div className="flex gap-4 mb-6">

<select
value={mes}
onChange={(e)=>setMes(e.target.value)}
className="bg-[#111827] border border-gray-700 p-2 rounded"
>

<option value="">Todos os meses</option>

{meses.map((m,i)=>(
<option key={i} value={i}>
{m}
</option>
))}

</select>

<input
placeholder="Filtrar categoria"
value={categoriaFiltro}
onChange={(e)=>setCategoriaFiltro(e.target.value)}
className="bg-[#111827] border border-gray-700 p-2 rounded"
/>

</div>

{/* FORMULÁRIO DE EDIÇÃO */}

{editarId && (

<div className="bg-[#111827] p-6 rounded-xl mb-6">

<h2 className="mb-4 font-bold">
Editar movimentação
</h2>

<input
className="w-full p-2 mb-3 rounded bg-[#0B0F1A] border border-gray-700"
value={categoria}
onChange={(e)=>setCategoria(e.target.value)}
placeholder="Categoria"
/>

<input
className="w-full p-2 mb-3 rounded bg-[#0B0F1A] border border-gray-700"
value={descricao}
onChange={(e)=>setDescricao(e.target.value)}
placeholder="Descrição"
/>

<input
type="number"
className="w-full p-2 mb-4 rounded bg-[#0B0F1A] border border-gray-700"
value={valor}
onChange={(e)=>setValor(e.target.value)}
placeholder="Valor"
/>

<button
onClick={salvarEdicao}
className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
>
Salvar edição
</button>

</div>

)}

<div className="bg-[#111827] rounded-xl p-6">

<table className="w-full">

<thead>

<tr className="text-gray-400 border-b border-gray-700">

<th className="text-left pb-3">Data</th>
<th className="text-left pb-3">Tipo</th>
<th className="text-left pb-3">Categoria</th>
<th className="text-left pb-3">Descrição</th>
<th className="text-right pb-3">Valor</th>
<th className="text-right pb-3">Ações</th>

</tr>

</thead>

<tbody>

{movimentacoes
.filter((mov)=>{

if(mes){

const data = mov.createdAt?.toDate();
if(data?.getMonth() !== Number(mes)) return false;

}

if(categoriaFiltro){

if(!mov.categoria
.toLowerCase()
.includes(categoriaFiltro.toLowerCase()))
return false;

}

return true;

})
.map((mov)=>{

const cor =
mov.tipo === "entrada"
? "text-green-400"
: "text-red-400";

const sinal =
mov.tipo === "entrada"
? "+"
: "-";

return(

<tr
key={mov.id}
className="border-b border-gray-800"
>

<td className="py-3">
{formatarData(mov.createdAt)}
</td>

<td>
{mov.tipo}
</td>

<td>
{mov.categoria}
</td>

<td>
{mov.descricao}
</td>

<td className={`text-right font-bold ${cor}`}>
{sinal} R$ {mov.valor}
</td>

<td className="text-right space-x-2">

<button
onClick={()=>editar(mov)}
className="bg-yellow-600 px-3 py-1 rounded text-sm hover:bg-yellow-700"
>
Editar
</button>

<button
onClick={()=>excluir(mov.id)}
className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700"
>
Excluir
</button>

</td>

</tr>

);

})}

</tbody>

</table>

</div>

</div>

);

}