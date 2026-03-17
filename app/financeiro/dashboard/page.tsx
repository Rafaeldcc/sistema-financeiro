"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/auth";

import {
collection,
getDocs,
query,
where
} from "firebase/firestore";

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
const [contas,setContas] = useState<any[]>([]);
const [patrimonioTotal,setPatrimonioTotal] = useState(0);

useEffect(()=>{

async function carregar(){

if(!auth.currentUser) return;

/* 🔥 TRANSAÇÕES FILTRADAS */

const q = query(
collection(db,"transacoes"),
where("userId","==",auth.currentUser.uid)
);

const snapshot = await getDocs(q);

/* 🔥 CONTAS */

const qContas = query(
collection(db,"contas"),
where("userId","==",auth.currentUser.uid)
);

const contasSnap = await getDocs(qContas);

const listaContas:any[] = [];

contasSnap.forEach((doc)=>{
listaContas.push({
id:doc.id,
...doc.data()
});
});

setContas(listaContas);

let patrimonio = 0;
listaContas.forEach((c)=>{
patrimonio += Number(c.saldo) || 0;
});
setPatrimonioTotal(patrimonio);

/* 🔥 TRANSAÇÕES */

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

if(data.tipo === "entrada") totalEntradas += valor;

if(data.tipo === "saida"){
totalSaidas += valor;

if(!mapa[categoria]) mapa[categoria] = 0;
mapa[categoria] += valor;
}

});

/* SALDO */

setEntradas(totalEntradas);
setSaidas(totalSaidas);

const saldoAtual = totalEntradas - totalSaidas;
setSaldo(saldoAtual);

/* CATEGORIAS */

setCategorias(
Object.keys(mapa).map(c=>({
name:c,
value:mapa[c]
}))
);

/* RELATÓRIO */

const totalGastos = Object.values(mapa).reduce((a:any,b:any)=>a+b,0);

setRelatorio(
Object.keys(mapa).map(c=>({
categoria:c,
percentual: totalGastos
? ((mapa[c]/totalGastos)*100).toFixed(1)
: "0"
}))
);

/* EVOLUÇÃO */

listaMov.sort((a,b)=>(a.createdAt?.seconds||0)-(b.createdAt?.seconds||0));

let saldoTemp = 0;

setEvolucao(listaMov.map(mov=>{
if(mov.tipo==="entrada") saldoTemp+=mov.valor;
if(mov.tipo==="saida") saldoTemp-=mov.valor;

const data = mov.createdAt?.toDate?.();

return {
data:data ? data.toLocaleDateString("pt-BR"):"",
saldo:saldoTemp
};
}));

/* COMPARAÇÃO */

const agora = new Date();
const mesAtual = agora.getMonth();
const anoAtual = agora.getFullYear();

let gastosMesAtual = 0;

listaMov.forEach((mov)=>{
if(mov.tipo !== "saida") return;

const data = mov.createdAt?.toDate?.();
if(!data) return;

if(data.getMonth() === mesAtual && data.getFullYear() === anoAtual){
gastosMesAtual += mov.valor;
}
});

setComparacao({ atual:gastosMesAtual });

/* PREVISÃO */

const diasRestantes = 30;

const mediaGasto = totalSaidas / (agora.getDate() || 1);

const previsaoFinal = saldoAtual - (mediaGasto * diasRestantes);

setPrevisao({
saldoAtual,
previsao:previsaoFinal.toFixed(2),
media:mediaGasto.toFixed(2)
});

/* IA ALERTAS */

const alertas:string[] = [];

if(totalSaidas > totalEntradas){
alertas.push("🚨 Você está gastando mais do que ganha");
}

if(totalSaidas > totalEntradas * 0.9){
alertas.push("⚠️ Seus gastos estão muito altos");
}

setAlertasIA(alertas);

}

carregar();

},[]);

const cores=["#6366F1","#22C55E","#EF4444","#F59E0B","#06B6D4"];

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

{/* PATRIMÔNIO */}

<div className="bg-[#111827] p-6 rounded-xl mb-6">
<h2 className="text-gray-400">Patrimônio total</h2>
<p className="text-3xl text-purple-400 font-bold">
R$ {patrimonioTotal.toFixed(2)}
</p>
</div>

{/* CONTAS */}

{contas.length > 0 && (
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
{contas.map((conta)=>(
<div key={conta.id} className="bg-[#111827] p-6 rounded-xl">
<h2 className="text-gray-400">{conta.nome}</h2>
<p className="text-xl text-purple-400">
R$ {Number(conta.saldo).toFixed(2)}
</p>
</div>
))}
</div>
)}

{/* ALERTAS */}

{alertasIA.map((a,i)=>(
<p key={i} className="text-yellow-400 mb-2">{a}</p>
))}

{/* CARDS */}

<div className="grid grid-cols-3 gap-6 mb-10">
<div>Entradas: R$ {entradas}</div>
<div>Saídas: R$ {saidas}</div>
<div>Saldo: R$ {saldo}</div>
</div>

{/* GRÁFICO */}

<ResponsiveContainer width="100%" height={250}>
<BarChart data={dadosBar}>
<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>
<Bar dataKey="valor" fill="#6366F1"/>
</BarChart>
</ResponsiveContainer>

{/* EVOLUÇÃO */}

<ResponsiveContainer width="100%" height={300}>
<LineChart data={evolucao}>
<XAxis dataKey="data"/>
<YAxis/>
<Tooltip/>
<Line dataKey="saldo" stroke="#22C55E"/>
</LineChart>
</ResponsiveContainer>

</div>

);

}