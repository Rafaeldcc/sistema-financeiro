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

import { onAuthStateChanged } from "firebase/auth";

import {
ResponsiveContainer,
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
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
const [metas,setMetas] = useState<any[]>([]);

useEffect(()=>{

const unsubscribe = onAuthStateChanged(auth, (user)=>{

if(!user?.uid) return;

async function carregar(){

try{

/* 🔥 TRANSAÇÕES */

const q = query(
collection(db,"transacoes"),
where("userId","==",user.uid)
);

const snapshot = await getDocs(q);

/* 🔥 CONTAS */

const qContas = query(
collection(db,"contas"),
where("userId","==",user.uid)
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

/* 🔥 METAS */

const qMetas = query(
collection(db,"metas"),
where("userId","==",user.uid)
);

const metasSnap = await getDocs(qMetas);

const listaMetas:any[] = [];

metasSnap.forEach((doc)=>{
listaMetas.push({
id:doc.id,
...doc.data()
});
});

setMetas(listaMetas);

/* 🔥 PROCESSAMENTO */

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

const totalGastos = Object.values(mapa).length
? Object.values(mapa).reduce((a:any,b:any)=>a+b,0)
: 0;

setRelatorio(
Object.keys(mapa).map(c=>({
categoria:c,
percentual: totalGastos
? ((mapa[c]/totalGastos)*100).toFixed(1)
: "0"
}))
);

/* EVOLUÇÃO */

listaMov.sort((a,b)=>{
const aTime = a.createdAt?.seconds || 0;
const bTime = b.createdAt?.seconds || 0;
return aTime - bTime;
});

let saldoTemp = 0;

setEvolucao(listaMov.map(mov=>{

if(mov.tipo==="entrada") saldoTemp+=mov.valor;
if(mov.tipo==="saida") saldoTemp-=mov.valor;

const data = mov.createdAt?.toDate
? mov.createdAt.toDate()
: null;

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

const data = mov.createdAt?.toDate
? mov.createdAt.toDate()
: null;

if(!data) return;

if(data.getMonth() === mesAtual && data.getFullYear() === anoAtual){
gastosMesAtual += mov.valor;
}
});

setComparacao({ atual:gastosMesAtual });

/* PREVISÃO */

const ultimoDia = new Date(agora.getFullYear(), agora.getMonth()+1, 0).getDate();
const diasRestantes = ultimoDia - agora.getDate();

const mediaGasto = totalSaidas / (agora.getDate() || 1);

const previsaoFinal = saldoAtual - (mediaGasto * diasRestantes);

setPrevisao({
saldoAtual,
previsao:previsaoFinal.toFixed(2),
media:mediaGasto.toFixed(2)
});

/* IA */

const alertas:string[] = [];

if(totalSaidas > totalEntradas){
alertas.push("🚨 Você está gastando mais do que ganha");
}

if(totalSaidas > totalEntradas * 0.9){
alertas.push("⚠️ Seus gastos estão no limite");
}

Object.keys(mapa).forEach((cat)=>{
const gasto = mapa[cat];

if(gasto > totalSaidas * 0.4){
alertas.push(`💸 Muito gasto com ${cat}`);
}
});

if(listaMov.length > 20){
alertas.push("📊 Muitas transações detectadas");
}

if(previsaoFinal < 0){
alertas.push("🔮 Risco de saldo negativo");
}

setAlertasIA(alertas);

}catch(e){
console.error("ERRO DASHBOARD:", e);
}

}

carregar();

});

return ()=> unsubscribe();

},[]);

const dadosBar=[
{ name:"Entradas", valor:entradas },
{ name:"Saídas", valor:saidas }
];

return(

<div>

<h1 className="text-2xl font-bold mb-8">
Dashboard Financeiro
</h1>

<div className="bg-[#111827] p-6 rounded-xl mb-6">
<h2 className="text-gray-400">Patrimônio total</h2>
<p className="text-3xl text-purple-400 font-bold">
R$ {patrimonioTotal.toFixed(2)}
</p>
</div>

{contas.map((conta)=>(
<div key={conta.id}>
{conta.nome} - R$ {Number(conta.saldo).toFixed(2)}
</div>
))}

{metas.map((m)=>{

const progresso = m.valor
? (m.tipo === "economia"
? (saldo / m.valor) * 100
: (saidas / m.valor) * 100)
: 0;

return(
<div key={m.id}>
{m.tipo} - {Math.min(progresso,100).toFixed(0)}%
</div>
);

})}

{alertasIA.map((a,i)=>(
<p key={i}>{a}</p>
))}

<ResponsiveContainer width="100%" height={250}>
<BarChart data={dadosBar}>
<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>
<Bar dataKey="valor"/>
</BarChart>
</ResponsiveContainer>

<ResponsiveContainer width="100%" height={300}>
<LineChart data={evolucao}>
<XAxis dataKey="data"/>
<YAxis/>
<Tooltip/>
<Line dataKey="saldo"/>
</LineChart>
</ResponsiveContainer>

</div>

);

}