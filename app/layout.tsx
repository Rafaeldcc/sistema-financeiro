import "./globals.css";
import Link from "next/link";

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {

return (

<html lang="pt-br">

<head>

<link rel="manifest" href="/manifest.json" />

<meta name="theme-color" content="#7C3AED" />

<link rel="apple-touch-icon" href="/icon-192.png" />

</head>

<body className="bg-[#0B0F1A] text-white">

<div className="flex min-h-screen flex-col md:flex-row">

{/* SIDEBAR DESKTOP */}

<aside className="hidden md:flex w-64 bg-[#0E1320] p-6 border-r border-gray-800 flex-col">

<h1 className="text-2xl font-bold text-[#7C3AED] mb-10">
Banco Rafael
</h1>

<nav className="space-y-4 text-gray-400">

<Link
href="/financeiro/dashboard"
className="block hover:text-white transition"
>
Dashboard
</Link>

<Link
href="/financeiro/entradas"
className="block hover:text-white transition"
>
Entradas
</Link>

<Link
href="/financeiro/saidas"
className="block hover:text-white transition"
>
Saídas
</Link>

<Link
href="/financeiro/extrato"
className="block hover:text-white transition"
>
Extrato
</Link>

<Link
href="/financeiro/metas"
className="block hover:text-white transition"
>
Metas
</Link>

<Link
href="/financeiro/contas"
className="block hover:text-white transition"
>
Contas
</Link>

<Link
href="/financeiro/insights"
className="block hover:text-white transition"
>
Insights IA
</Link>

</nav>

</aside>

{/* CONTEÚDO PRINCIPAL */}

<main className="flex-1 p-6 md:p-10 bg-gradient-to-br from-[#0B0F1A] to-[#111827] pb-24 md:pb-10">

{/* MENU MOBILE SUPERIOR */}

<div className="md:hidden mb-6">

<h1 className="text-xl font-bold text-[#7C3AED] mb-4">
Banco Rafael
</h1>

</div>

{children}

</main>

</div>

{/* MENU MOBILE INFERIOR */}

<nav className="fixed bottom-0 left-0 right-0 md:hidden bg-[#0E1320] border-t border-gray-800 flex justify-around py-3 text-sm">

<Link
href="/financeiro/dashboard"
className="flex flex-col items-center text-gray-300"
>
🏠
<span>Dashboard</span>
</Link>

<Link
href="/financeiro/entradas"
className="flex flex-col items-center text-green-400"
>
➕
<span>Entrada</span>
</Link>

<Link
href="/financeiro/saidas"
className="flex flex-col items-center text-red-400"
>
➖
<span>Saída</span>
</Link>

<Link
href="/financeiro/extrato"
className="flex flex-col items-center text-gray-300"
>
📄
<span>Extrato</span>
</Link>

<Link
href="/financeiro/metas"
className="flex flex-col items-center text-purple-400"
>
🎯
<span>Metas</span>
</Link>

<Link
href="/financeiro/contas"
className="flex flex-col items-center text-yellow-400"
>
🏦
<span>Contas</span>
</Link>

<Link
href="/financeiro/insights"
className="flex flex-col items-center text-blue-400"
>
🧠
<span>IA</span>
</Link>

</nav>

</body>

</html>

);
}