import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

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

interface MonthlyData {
  [month: string]: Transaction[];
}

interface ChartData {
  month: string;
  total: number;
  fill: string;
}

function MonthlyExpensesChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const fetchMonthlyExpenses = async () => {
    try {
      const response = await axios.get<{ data: MonthlyData }>(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction/filter/monthly`,
        { withCredentials: true }
      );
      
      const transactions = response.data.data || {};
      
      const monthTotals: ChartData[] = Object.keys(transactions).map(month => {
        const total = transactions[month].reduce((sum, transaction) => {
          return transaction.type === "credit" ? sum + transaction.amount : sum - transaction.amount;
        }, 0);
        return { month, total, fill: total < 0 ? "#ff4d4d" : "#ffffff" };
      });

      setChartData(monthTotals);
    } catch (error) {
      console.error("Error fetching monthly transactions:", error);
    }
  };

  useEffect(() => {
    fetchMonthlyExpenses();
  }, []);

  return (
    <div className="w-full h-[460px]  rounded-2xl p-4">
      <h2 className="text-xl font-bold text-center mb-4">Yearly Expenses Overview</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip wrapperStyle={{ backgroundColor: "transparent" }} />
          <Bar dataKey="total" barSize={40}>
            {chartData.map((entry, index) => (
              <Bar key={index} dataKey="total" fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyExpensesChart;
