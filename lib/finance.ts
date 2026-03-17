// ===============================
// TYPES (TIPAGEM FORTE)
// ===============================

type Transacao = {
  tipo: "entrada" | "saida";
  valor: number;
  categoria?: string;
  createdAt?: any;
};

type Divida = {
  saldo: number;
};

// ===============================
// TOTAL FINANCEIRO
// ===============================

export function calculateTotals(transactions: Transacao[]) {
  let entradas = 0;
  let saidas = 0;

  transactions.forEach((t) => {
    const valor = Number(t.valor) || 0;

    if (t.tipo === "entrada") entradas += valor;
    if (t.tipo === "saida") saidas += valor;
  });

  return {
    entradas,
    saidas,
    saldo: entradas - saidas,
  };
}

// ===============================
// SIMULAÇÃO DE DÍVIDA
// ===============================

export function calculateDebtSimulation(
  dividas: Divida[],
  valorMensal: number
) {
  const totalDivida = dividas.reduce(
    (acc, d) => acc + (Number(d.saldo) || 0),
    0
  );

  if (valorMensal <= 0) {
    return {
      meses: 0,
      totalDivida,
    };
  }

  const meses = Math.ceil(totalDivida / valorMensal);

  return {
    meses,
    totalDivida,
  };
}

// ===============================
// AGRUPAR POR CATEGORIA
// ===============================

export function groupByCategory(transactions: Transacao[]) {
  const mapa: Record<string, number> = {};

  transactions.forEach((t) => {
    if (t.tipo !== "saida") return;

    const categoria = t.categoria || "Outros";
    const valor = Number(t.valor) || 0;

    if (!mapa[categoria]) {
      mapa[categoria] = 0;
    }

    mapa[categoria] += valor;
  });

  return Object.keys(mapa).map((categoria) => ({
    name: categoria,
    value: mapa[categoria],
  }));
}

// ===============================
// EVOLUÇÃO DO SALDO
// ===============================

export function calculateEvolution(transactions: Transacao[]) {
  const lista = [...transactions];

  lista.sort((a, b) => {
    const aData = a.createdAt?.seconds || 0;
    const bData = b.createdAt?.seconds || 0;
    return aData - bData;
  });

  let saldo = 0;

  return lista.map((t) => {
    const valor = Number(t.valor) || 0;

    if (t.tipo === "entrada") saldo += valor;
    if (t.tipo === "saida") saldo -= valor;

    const data = t.createdAt?.toDate?.();

    return {
      data: data ? data.toLocaleDateString("pt-BR") : "",
      saldo,
    };
  });
}

// ===============================
// MÉDIA MENSAL
// ===============================

export function calculateMonthlyAverage(transactions: Transacao[]) {
  const mapaMeses: Record<string, number> = {};

  transactions.forEach((t) => {
    if (t.tipo !== "entrada") return;

    const data = t.createdAt?.toDate?.();
    if (!data) return;

    const chave = `${data.getFullYear()}-${data.getMonth()}`;
    const valor = Number(t.valor) || 0;

    if (!mapaMeses[chave]) {
      mapaMeses[chave] = 0;
    }

    mapaMeses[chave] += valor;
  });

  const meses = Object.keys(mapaMeses).length;

  if (meses === 0) return 0;

  const total = Object.values(mapaMeses).reduce(
    (acc, v) => acc + v,
    0
  );

  return total / meses;
}

// ===============================
// ALERTAS IA
// ===============================

export function generateAlerts(
  entradas: number,
  saidas: number,
  categorias: Record<string, number>
) {
  const alertas: string[] = [];

  if (saidas > entradas) {
    alertas.push("🚨 Você está gastando mais do que ganha");
  }

  if (saidas > entradas * 0.9) {
    alertas.push("⚠️ Seus gastos estão muito altos");
  }

  let maiorCategoria = "";
  let maiorValor = 0;

  Object.keys(categorias).forEach((c) => {
    if (categorias[c] > maiorValor) {
      maiorValor = categorias[c];
      maiorCategoria = c;
    }
  });

  if (maiorCategoria && saidas > 0) {
    const percentual = (maiorValor / saidas) * 100;

    if (percentual > 40) {
      alertas.push(
        `⚠️ ${maiorCategoria} representa ${percentual.toFixed(0)}% dos seus gastos`
      );
    }
  }

  return alertas;
}