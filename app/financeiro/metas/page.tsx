"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
collection,
addDoc,
getDocs
} from "firebase/firestore";

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts";

export default function Metas(){

const [nome,setNome] = useState("");
const [valor,setValor] = useState("");
const [metas,setMetas] = useState<any[]>([]);
const [saldo,setSaldo] = useState(0);
const [mediaMensal,setMediaMensal] = useState(0);

async function salvar(){

if(!nome || !valor){
alert("Preencha todos os campos");
return;
}

await addDoc(collection(db,"metas"),{
nome:nome,
valor:Number(valor)
});

setNome("");
setValor("");

carregar();

}

async function carregar(){

const snapshot = await getDocs(collection(db,"metas"));

const lista:any[] = [];

snapshot.forEach((doc)=>{
lista.push({
id:doc.id,
...doc.data()
});
});

setMetas(lista);

/* CALCULAR SALDO */

const transacoes = await getDocs(collection(db,"transacoes"));

let entradas = 0;
let saidas = 0;

const mapaMeses:any = {};

transacoes.forEach((doc)=>{

const data:any = doc.data();
const valor = Number(data.valor) || 0;

if(data.tipo === "entrada"){
entradas += valor;

const dataMov = data.createdAt?.toDate?.();

if(dataMov){

const chave = `${dataMov.getFullYear()}-${dataMov.getMonth()}`;

if(!mapaMeses[chave]){
mapaMeses[chave] = 0;
}

mapaMeses[chave] += valor;

}

}

if(data.tipo === "saida"){
saidas += valor;
}

});

setSaldo(entradas - saidas);

/* MÉDIA MENSAL */

const meses = Object.keys(mapaMeses).length;

let soma = 0;

Object.values(mapaMeses).forEach((v:any)=>{
soma += v;
});

const media =
meses > 0
? soma / meses
: 0;

setMediaMensal(media);

}

useEffect(()=>{
carregar();
},[]);

return(

<div>

<h1 className="text-2xl font-bold mb-8">
Metas Financeiras
</h1>

<div className="bg-[#111827] p-6 rounded-xl mb-10">

<input
className="w-full p-3 mb-3 rounded bg-[#0B0F1A] border border-gray-700"
placeholder="Nome da meta"
value={nome}
onChange={(e)=>setNome(e.target.value)}
/>

<input
type="number"
className="w-full p-3 mb-4 rounded bg-[#0B0F1A] border border-gray-700"
placeholder="Valor da meta"
value={valor}
onChange={(e)=>setValor(e.target.value)}
/>

<button
onClick={salvar}
className="bg-purple-600 px-5 py-2 rounded hover:bg-purple-700"
>
Criar Meta
</button>

</div>

<div className="grid gap-6">

{metas.map((meta)=>{

const objetivo = Number(meta.valor) || 0;

const progresso =
objetivo > 0
? Math.min((saldo / objetivo) * 100, 100)
: 0;

const falta = Math.max(objetivo - saldo,0);

const mesesRestantes =
mediaMensal > 0
? Math.ceil(falta / mediaMensal)
: 0;

/* ALERTAS INTELIGENTES */

let alerta = "";

if(progresso >= 90){
alerta = "🎯 Meta muito próxima de ser atingida";
}
else if(mesesRestantes > 24){
alerta = "⚠ Neste ritmo você levará mais de 2 anos para atingir a meta";
}
else if(mediaMensal < objetivo * 0.02){
alerta = "⚠ Sua economia mensal está muito baixa para essa meta";
}
else if(progresso > 50){
alerta = "🎉 Você está avançando rápido nessa meta";
}

const dadosGrafico = [
{ name:"Atual", valor: saldo },
{ name:"Meta", valor: objetivo }
];

return(

<div
key={meta.id}
className="bg-[#111827] p-6 rounded-xl"
>

<h2 className="text-lg mb-2">
{meta.nome}
</h2>

<p className="text-gray-400 mb-1">
Objetivo: R$ {objetivo}
</p>

<p className="text-gray-400 mb-3">
Saldo atual: R$ {saldo}
</p>

<div className="w-full bg-gray-700 h-3 rounded">

<div
className="bg-purple-500 h-3 rounded"
style={{
width:`${progresso}%`
}}
></div>

</div>

<p className="text-sm mt-2 text-purple-400 font-bold">
{progresso.toFixed(0)}% concluído
</p>

<p className="text-sm text-gray-400 mt-2">
Faltam: R$ {falta.toFixed(0)}
</p>

<p className="text-sm text-gray-400">
Economia média mensal: R$ {mediaMensal.toFixed(0)}
</p>

{mesesRestantes > 0 && (

<p className="text-sm text-green-400 font-bold mt-2">
Meta atingida em aproximadamente {mesesRestantes} meses
</p>

)}

{alerta && (

<p className="text-sm text-yellow-400 font-bold mt-2">
{alerta}
</p>

)}

<div className="mt-6">

<ResponsiveContainer width="100%" height={200}>

<BarChart data={dadosGrafico}>

<XAxis dataKey="name" stroke="#9CA3AF"/>

<YAxis stroke="#9CA3AF"/>

<Tooltip/>

<Bar dataKey="valor" fill="#8B5CF6"/>

</BarChart>

</ResponsiveContainer>

</div>

</div>

);

})}

</div>

</div>

);

}