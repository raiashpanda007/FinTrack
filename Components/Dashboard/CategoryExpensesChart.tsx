import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
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

interface CategoryData {
  [category: string]: Transaction[];
}

interface ChartData {
  name: string;
  value: number;
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

function CategoryExpensesChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const fetchCategoryExpenses = async () => {
    try {
      const response = await axios.get<{ data: CategoryData }>(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction/filter/category`,
        { withCredentials: true }
      );
      
      const transactions = response.data.data || {};
      
      const categoryTotals: ChartData[] = Object.keys(transactions)
        .map(category => {
          const total = transactions[category]
            .filter(transaction => transaction.type === "debit")
            .reduce((sum, transaction) => sum + transaction.amount, 0);
          return total > 0 ? { name: category, value: total } : null;
        })
        .filter(Boolean) as ChartData[];

      setChartData(categoryTotals);
    } catch (error) {
      console.error("Error fetching category transactions:", error);
    }
  };

  useEffect(() => {
    fetchCategoryExpenses();
  }, []);

  return (
    <div className="w-full flex flex-col items-center border rounded-2xl p-4">
      <h2 className="text-xl font-bold text-center mb-4">Category-wise Expenses</h2>
      <div className="flex w-full justify-center items-center">
        <ResponsiveContainer width="50%" height={400}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || "#000000"} />
              ))}
            </Pie>
            <Tooltip wrapperStyle={{ backgroundColor: "transparent" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col ml-8">
          {chartData.map((entry, index) => (
            <div key={index} className="flex items-center mb-2">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: CATEGORY_COLORS[entry.name] || "#000000" }}
              ></div>
              <span>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryExpensesChart;