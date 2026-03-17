"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
collection,
addDoc,
getDocs,
updateDoc,
deleteDoc,
doc
} from "firebase/firestore";

export default function Contas(){

const [nome,setNome] = useState("");
const [saldoInicial,setSaldoInicial] = useState("");
const [meta,setMeta] = useState("");
const [prazo,setPrazo] = useState("");

const [contas,setContas] = useState<any[]>([]);
const [valoresEntrada,setValoresEntrada] = useState<any>({});

async function salvar(){

if(!nome){
alert("Digite o nome da conta");
return;
}

await addDoc(collection(db,"contas"),{

nome:nome,
saldo:Number(saldoInicial) || 0,
meta:Number(meta) || 0,
prazo:Number(prazo) || 12

});

setNome("");
setSaldoInicial("");
setMeta("");
setPrazo("");

carregar();

}

async function adicionarEntrada(conta:any){

const valor = Number(valoresEntrada[conta.id] || 0);

if(!valor){
alert("Digite um valor");
return;
}

await updateDoc(doc(db,"contas",conta.id),{
saldo:(Number(conta.saldo) || 0) + valor
});

setValoresEntrada({
...valoresEntrada,
[conta.id]:""
});

carregar();

}

async function excluirConta(id:string){

if(!confirm("Excluir essa conta?")) return;

await deleteDoc(doc(db,"contas",id));

carregar();

}

async function carregar(){

const snapshot = await getDocs(collection(db,"contas"));

const lista:any[] = [];

snapshot.forEach((docItem)=>{

lista.push({
id:docItem.id,
...docItem.data()
});

});

setContas(lista);

}

useEffect(()=>{
carregar();
},[]);

return(

<div>

<h1 className="text-2xl font-bold mb-8">
Contas
</h1>

{/* CRIAR CONTA */}

<div className="bg-[#111827] p-6 rounded-xl mb-10">

<input
className="w-full p-3 mb-4 rounded bg-[#0B0F1A] border border-gray-700"
placeholder="Nome da conta"
value={nome}
onChange={(e)=>setNome(e.target.value)}
/>

<input
className="w-full p-3 mb-4 rounded bg-[#0B0F1A] border border-gray-700"
placeholder="Saldo inicial"
value={saldoInicial}
onChange={(e)=>setSaldoInicial(e.target.value)}
/>

<input
className="w-full p-3 mb-4 rounded bg-[#0B0F1A] border border-gray-700"
placeholder="Meta (ex: 5000)"
value={meta}
onChange={(e)=>setMeta(e.target.value)}
/>

<input
className="w-full p-3 mb-4 rounded bg-[#0B0F1A] border border-gray-700"
placeholder="Prazo em meses (ex: 12)"
value={prazo}
onChange={(e)=>setPrazo(e.target.value)}
/>

<button
onClick={salvar}
className="bg-purple-600 px-5 py-2 rounded hover:bg-purple-700"
>
Criar Conta
</button>

</div>

{/* CONTAS */}

<div className="grid gap-6">

{contas.map((conta)=>{

const saldo = Number(conta.saldo) || 0;
const metaConta = Number(conta.meta) || 0;
const prazoConta = Number(conta.prazo) || 12;

const progresso =
metaConta > 0
? Math.min((saldo/metaConta)*100,100)
: 0;

const faltante = metaConta - saldo;

const valorMensal =
faltante > 0
? faltante / prazoConta
: 0;

return(

<div
key={conta.id}
className="bg-[#111827] p-6 rounded-xl"
>

<h2 className="text-lg mb-1">
{conta.nome}
</h2>

<p className="text-gray-400 mb-2">
Saldo: R$ {saldo.toFixed(2)}
</p>

{/* META */}

{metaConta > 0 && (

<>

<p className="text-gray-400 text-sm mb-1">
Meta: R$ {metaConta.toFixed(2)}
</p>

<p className="text-gray-400 text-xs mb-1">
Prazo: {prazoConta} meses
</p>

<div className="w-full bg-gray-700 rounded-full h-3 mb-2">

<div
className="bg-purple-500 h-3 rounded-full transition-all"
style={{width:`${progresso}%`}}
/>

</div>

<p className="text-xs text-gray-400 mb-2">
{progresso.toFixed(1)}% da meta
</p>

{/* IA FINANCEIRA */}

{saldo < metaConta && (

<>

<p className="text-yellow-400 text-sm">
Faltam: R$ {faltante.toFixed(2)}
</p>

<p className="text-purple-400 text-xs mb-3">
IA financeira: guarde R$ {valorMensal.toFixed(2)} por mês para atingir a meta
</p>

</>

)}

{saldo >= metaConta && (

<p className="text-green-400 text-sm mb-3">
🎉 Meta atingida!
</p>

)}

</>

)}

{/* IA INVESTIMENTO */}

{saldo < metaConta && (

<>

{(() => {

const taxa = 0.01; // 1% ao mês

const faltante = metaConta - saldo;

const meses = prazoConta;

const valorMensalSimples = faltante / meses;

const valorMensalInvestindo =
valorMensalSimples * (1 - taxa * meses * 0.5);

return(

<div className="mt-2">

<p className="text-blue-400 text-xs">
IA investimento:
</p>

<p className="text-blue-300 text-xs">
Com rendimento de 1% ao mês você poderia guardar aproximadamente
R$ {valorMensalInvestindo.toFixed(2)} por mês
</p>

<p className="text-gray-400 text-xs">
Isso reduz seu esforço mensal usando juros compostos.
</p>

</div>

)

})()}

</>

)}

{/* ADICIONAR DINHEIRO */}

<div className="flex gap-3 mb-3">

<input
className="flex-1 p-2 rounded bg-[#0B0F1A] border border-gray-700"
placeholder="Adicionar dinheiro"
value={valoresEntrada[conta.id] || ""}
onChange={(e)=>
setValoresEntrada({
...valoresEntrada,
[conta.id]:e.target.value
})
}
/>

<button
onClick={()=>adicionarEntrada(conta)}
className="bg-green-600 px-4 rounded hover:bg-green-700"
>
+ Entrada
</button>

</div>

<button
onClick={()=>excluirConta(conta.id)}
className="bg-red-600 px-4 py-1 rounded hover:bg-red-700"
>
Excluir conta
</button>

</div>

)

})}

</div>

</div>

);

}