"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Insights(){

const [insights,setInsights] = useState<string[]>([]);

async function analisar(){

const snapshot = await getDocs(collection(db,"transacoes"));

let entradas = 0;
let saidas = 0;

const mapaCategorias:any = {};

snapshot.forEach((doc)=>{

const data:any = doc.data();
const valor = Number(data.valor) || 0;

if(data.tipo === "entrada"){
entradas += valor;
}

if(data.tipo === "saida"){

saidas += valor;

const categoria = data.categoria || "Outros";

if(!mapaCategorias[categoria]){
mapaCategorias[categoria] = 0;
}

mapaCategorias[categoria] += valor;

}

});

const lista:string = [];

/* MAIOR GASTO */

let maiorCategoria = "";
let maiorValor = 0;

Object.keys(mapaCategorias).forEach((c)=>{

if(mapaCategorias[c] > maiorValor){
maiorValor = mapaCategorias[c];
maiorCategoria = c;
}

});

if(maiorCategoria){

const percentual = ((maiorValor/saidas)*100).toFixed(0);

lista.push(
`Você gastou ${percentual}% do dinheiro em ${maiorCategoria}`
);

}

/* EQUILÍBRIO FINANCEIRO */

if(entradas > saidas){

lista.push("Seu saldo está positivo, você está economizando dinheiro");

}else{

lista.push("Seus gastos estão maiores que suas entradas");

}

/* CONCENTRAÇÃO DE GASTOS */

if(maiorValor > saidas * 0.4){

lista.push(
`Grande concentração de gastos em ${maiorCategoria}`
);

}

/* ALERTA DE GASTO */

if(saidas > entradas * 0.9){

lista.push(
"Seus gastos estão muito próximos da sua renda"
);

}

setInsights(lista);

}

useEffect(()=>{
analisar();
},[]);

return(

<div>

<h1 className="text-2xl font-bold mb-8">
Inteligência Financeira
</h1>

<div className="grid gap-4">

{insights.map((i,index)=>(

<div
key={index}
className="bg-[#111827] p-6 rounded-xl"
>

🧠 {i}

</div>

))}

</div>

</div>

);

}
