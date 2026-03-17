export function calculateTotals(transactions: any[]) {
  let income = 0;
  let expense = 0;

  transactions.forEach((t) => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  return {
    income,
    expense,
    saldo: income - expense,
  };
}

export function calculateDebtSimulation(
  debts: any[],
  monthlyExtra: number
) {
  const totalDebt = debts.reduce(
    (acc, d) => acc + d.balance,
    0
  );

  if (monthlyExtra <= 0) {
    return { months: 0, totalDebt };
  }

  const months = Math.ceil(totalDebt / monthlyExtra);

  return { months, totalDebt };
}