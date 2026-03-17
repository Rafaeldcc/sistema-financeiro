"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

import {
PieChart,
Pie,
Cell,
Tooltip,
BarChart,
Bar,
XAxis,
YAxis,
CartesianGrid,
ResponsiveContainer,
LineChart,
Line
} from "recharts";

export default function Dashboard(){

const [entradas,setEntradas] = useState(0);
const [saidas,setSaidas] = useState(0);
const [saldo,setSaldo] = useState(0);
const [categorias,setCategorias] = useState<any[]>([]);
const [relatorio,setRelatorio] = useState<any[]>([]);
const [evolucao,setEvolucao] = useState<any[]>([]);
const [comparacao,setComparacao] = useState<any>(null);
const [previsao,setPrevisao] = useState<any>(null);
const [alertasIA,setAlertasIA] = useState<string[]>([]);

useEffect(()=>{

async function carregar(){

const snapshot = await getDocs(collection(db,"transacoes"));

let totalEntradas = 0;
let totalSaidas = 0;

const mapa:any = {};
const listaMov:any[] = [];

snapshot.forEach((docItem)=>{

const data:any = docItem.data();

const valor = Number(data.valor) || 0;
const categoria = data.categoria || "Outros";

listaMov.push({
...data,
valor,
categoria
});

if(data.tipo === "entrada"){
totalEntradas += valor;
}

if(data.tipo === "saida"){

totalSaidas += valor;

if(!mapa[categoria]){
mapa[categoria] = 0;
}

mapa[categoria] += valor;

}

});

/* CATEGORIAS */

const listaCategorias = Object.keys(mapa).map((c)=>({
name:c,
value:mapa[c]
}));

setCategorias(listaCategorias);

/* RELATÓRIO */

let totalGastos = 0;

Object.values(mapa).forEach((v:any)=>{
totalGastos += Number(v);
});

const listaRelatorio = Object.keys(mapa).map((c)=>({
categoria:c,
percentual: totalGastos
? ((mapa[c] / totalGastos) * 100).toFixed(1)
: "0"
}));

setRelatorio(listaRelatorio);

/* SALDOS */

setEntradas(totalEntradas);
setSaidas(totalSaidas);

const saldoAtual = totalEntradas-totalSaidas;
setSaldo(saldoAtual);

/* EVOLUÇÃO */

listaMov.sort((a,b)=>{
const aData = a.createdAt?.seconds ?? 0;
const bData = b.createdAt?.seconds ?? 0;
return aData - bData;
});

let saldoTemp = 0;
const evolucaoTemp:any[] = [];

listaMov.forEach((mov)=>{

if(mov.tipo === "entrada"){
saldoTemp += mov.valor;
}

if(mov.tipo === "saida"){
saldoTemp -= mov.valor;
}

const data = mov.createdAt?.toDate?.();

evolucaoTemp.push({
data:data ? data.toLocaleDateString("pt-BR") : "",
saldo:saldoTemp
});

});

setEvolucao(evolucaoTemp);

/* COMPARAÇÃO */

const agora = new Date();
const mesAtual = agora.getMonth();
const anoAtual = agora.getFullYear();

const mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1;
const anoMesAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;

let gastosMesAtual = 0;
let gastosMesAnterior = 0;

listaMov.forEach((mov)=>{

if(mov.tipo !== "saida") return;

const data = mov.createdAt?.toDate?.();
if(!data) return;

const mes = data.getMonth();
const ano = data.getFullYear();

if(mes === mesAtual && ano === anoAtual){
gastosMesAtual += mov.valor;
}

if(mes === mesAnterior && ano === anoMesAnterior){
gastosMesAnterior += mov.valor;
}

});

let percentual = 0;

if(gastosMesAnterior > 0){
percentual = ((gastosMesAtual - gastosMesAnterior) / gastosMesAnterior) * 100;
}

setComparacao({
atual:gastosMesAtual,
anterior:gastosMesAnterior,
percentual:percentual.toFixed(1)
});

/* PREVISÃO */

const diaAtual = agora.getDate();

const ultimoDiaMes = new Date(
agora.getFullYear(),
agora.getMonth()+1,
0
).getDate();

const diasRestantes = ultimoDiaMes - diaAtual;

let gastosMes = 0;
const diasComGasto = new Set<number>();

listaMov.forEach((mov)=>{

if(mov.tipo !== "saida") return;

const data = mov.createdAt?.toDate?.();
if(!data) return;

if(
data.getMonth() === mesAtual &&
data.getFullYear() === anoAtual
){
gastosMes += mov.valor;
diasComGasto.add(data.getDate());
}

});

const mediaGastoDia =
diasComGasto.size > 0
? gastosMes / diasComGasto.size
: 0;

const previsaoFinal =
saldoAtual - (mediaGastoDia * diasRestantes);

setPrevisao({
saldoAtual: saldoAtual,
previsao: previsaoFinal.toFixed(2),
media: mediaGastoDia.toFixed(2)
});

/* IA ALERTAS */

const alertas:string[] = [];

let maiorCategoria = "";
let maiorValor = 0;

Object.keys(mapa).forEach((c)=>{

if(mapa[c] > maiorValor){
maiorValor = mapa[c];
maiorCategoria = c;
}

});

if(maiorCategoria){

const percentualCategoria =
totalSaidas > 0
? (maiorValor / totalSaidas) * 100
: 0;

if(percentualCategoria > 40){
alertas.push(`⚠️ ${maiorCategoria} representa ${percentualCategoria.toFixed(0)}% dos seus gastos`);
}

}

if(totalSaidas > totalEntradas * 0.9){
alertas.push("⚠️ Seus gastos estão muito próximos da sua renda");
}

if(totalSaidas > totalEntradas){
alertas.push("🚨 Você está gastando mais do que ganha");
}

if(maiorValor > totalSaidas * 0.5){
alertas.push(`⚠️ Grande concentração de gastos em ${maiorCategoria}`);
}

setAlertasIA(alertas);

}

carregar();

},[]);

const cores=[
"#6366F1",
"#22C55E",
"#EF4444",
"#F59E0B",
"#06B6D4"
];

const dadosBar=[
{ name:"Entradas", valor:entradas },
{ name:"Saídas", valor:saidas }
];

const dadosSaldo=[
{ name:"Saldo", value:saldo },
{ name:"Saídas", value:saidas }
];

return(

<div>

<h1 className="text-2xl font-bold mb-8">
Dashboard Financeiro
</h1>

{/* ALERTAS IA */}

{alertasIA.length > 0 && (

<div className="bg-[#111827] p-6 rounded-xl mb-10">

<h2 className="text-lg mb-4">
🧠 Alertas da IA
</h2>

{alertasIA.map((alerta,index)=>(
<p key={index} className="text-yellow-400 mb-2">
{alerta}
</p>
))}

</div>

)}

{/* CARDS */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

<div className="bg-[#111827] p-6 rounded-xl">
<h2 className="text-gray-400 mb-2">Entradas</h2>
<p className="text-2xl text-green-400 font-bold">
R$ {entradas}
</p>
</div>

<div className="bg-[#111827] p-6 rounded-xl">
<h2 className="text-gray-400 mb-2">Saídas</h2>
<p className="text-2xl text-red-400 font-bold">
R$ {saidas}
</p>
</div>

<div className="bg-[#111827] p-6 rounded-xl">
<h2 className="text-gray-400 mb-2">Saldo</h2>
<p className="text-2xl text-blue-400 font-bold">
R$ {saldo}
</p>
</div>

</div>

{/* GRÁFICOS */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-8">

<div className="bg-[#111827] p-6 rounded-xl">

<h2 className="mb-4 text-lg">
Entradas vs Saídas
</h2>

<ResponsiveContainer width="100%" height={250}>
<BarChart data={dadosBar}>
<CartesianGrid strokeDasharray="3 3"/>
<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>
<Bar dataKey="valor" fill="#6366F1"/>
</BarChart>
</ResponsiveContainer>

</div>

<div className="bg-[#111827] p-6 rounded-xl">

<h2 className="mb-4 text-lg">
Gastos por categoria
</h2>

{categorias.length === 0 ? (
<p className="text-gray-400">
Nenhum gasto registrado.
</p>
) : (
<ResponsiveContainer width="100%" height={250}>
<PieChart>
<Pie data={categorias} dataKey="value" nameKey="name" outerRadius={90} label>
{categorias.map((entry,index)=>(
<Cell key={index} fill={cores[index%cores.length]}/>
))}
</Pie>
<Tooltip/>
</PieChart>
</ResponsiveContainer>
)}

</div>

<div className="bg-[#111827] p-6 rounded-xl">

<h2 className="mb-4 text-lg">
Distribuição financeira
</h2>

<ResponsiveContainer width="100%" height={250}>
<PieChart>
<Pie data={dadosSaldo} dataKey="value" nameKey="name" outerRadius={90} label>
<Cell fill="#22C55E"/>
<Cell fill="#EF4444"/>
</Pie>
<Tooltip/>
</PieChart>
</ResponsiveContainer>

</div>

</div>

{/* RELATÓRIO */}

<div className="bg-[#111827] p-6 rounded-xl mt-10">

<h2 className="text-lg mb-4">
Relatório financeiro do mês
</h2>

{relatorio.length === 0 ? (
<p className="text-gray-400">
Nenhum gasto registrado.
</p>
) : (
<div className="space-y-2">
{relatorio.map((item,index)=>(
<div key={index} className="flex justify-between border-b border-gray-700 pb-1">
<span>{item.categoria}</span>
<span className="text-purple-400 font-bold">
{item.percentual}%
</span>
</div>
))}
</div>
)}

</div>

{/* COMPARAÇÃO */}

{comparacao && (

<div className="bg-[#111827] p-6 rounded-xl mt-10">

<h2 className="text-lg mb-4">
Comparação de meses
</h2>

<div className="space-y-2">

<div className="flex justify-between">
<span>Mês atual</span>
<span className="text-red-400 font-bold">
R$ {comparacao.atual}
</span>
</div>

<div className="flex justify-between">
<span>Mês passado</span>
<span className="text-gray-300 font-bold">
R$ {comparacao.anterior}
</span>
</div>

</div>

</div>

)}

{/* PREVISÃO */}

{previsao && (

<div className="bg-[#111827] p-6 rounded-xl mt-10">

<h2 className="text-lg mb-4">
Previsão de saldo do mês
</h2>

<div className="space-y-2">

<div className="flex justify-between">
<span>Saldo atual</span>
<span className="text-blue-400 font-bold">
R$ {previsao.saldoAtual}
</span>
</div>

<div className="flex justify-between">
<span>Previsão final</span>
<span className="text-green-400 font-bold">
R$ {previsao.previsao}
</span>
</div>

<div className="flex justify-between">
<span>Média de gasto diário</span>
<span className="text-gray-300">
R$ {previsao.media}
</span>
</div>

</div>

</div>

)}

{/* EVOLUÇÃO */}

<div className="bg-[#111827] p-6 rounded-xl mt-10">

<h2 className="text-lg mb-4">
Evolução do patrimônio
</h2>

<ResponsiveContainer width="100%" height={300}>

<LineChart data={evolucao}>
<CartesianGrid strokeDasharray="3 3"/>
<XAxis dataKey="data"/>
<YAxis/>
<Tooltip/>
<Line
type="monotone"
dataKey="saldo"
stroke="#22C55E"
strokeWidth={3}
/>
</LineChart>

</ResponsiveContainer>

</div>

</div>

);

}