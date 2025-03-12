import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  type: "credit" | "debit";
  date: string;
}

interface Budget {
  category: string;
  amount: number;
}

interface ChartData {
  category: string;
  actual: number;
  budget: number;
}

const CATEGORY_COLORS: { [key: string]: string } = {
  Rent: "#ff4d4d",
  Electricity: "#ff6666",
  Water: "#ff8080",
  Internet: "#ff9999",
  Transportation: "#ffb3b3",
  "Dining Out": "#ffcc99",
  Salary: "#66b3ff",
  Dividend: "#99ff99",
  Other: "#cccccc"
};

interface BudgetComparisonChartProps {
  budgets: Budget[];
  transactions: { [category: string]: Transaction[] };
}

function BudgetComparisonChart({ budgets, transactions }: BudgetComparisonChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const categoryTotals: { [key: string]: number } = {};
    
    Object.keys(transactions).forEach(category => {
      categoryTotals[category] = transactions[category]
        .filter(transaction => transaction.type === "debit")
        .reduce((sum, transaction) => sum + transaction.amount, 0);
    });
    
    const chartDataFormatted: ChartData[] = budgets.map(budget => ({
      category: budget.category,
      actual: categoryTotals[budget.category] || 0,
      budget: budget.amount
    }));

    setChartData(chartDataFormatted);
  }, [budgets, transactions]);

  return (
    <div className="w-full flex flex-col items-center border rounded-2xl p-4">
      <h2 className="text-xl font-bold text-center mb-4">Budget vs. Actual Expenses</h2>
      <ResponsiveContainer width="80%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="actual" fill="#ff4d4d" name="Actual Expenses" />
          <Bar dataKey="budget" fill="#66b3ff" name="Budgeted Amount" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BudgetComparisonChart;
