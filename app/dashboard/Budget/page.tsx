"use client";
import SelectCategories from "@/Components/Landing/SelectCategories";
import SelectMonths from "@/Components/Dashboard/SelectMonth";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import PrimaryButton from "@/Components/PrimaryButton";
import BudgetComparisonChart from "@/Components/Dashboard/ComparisionCharts";

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

function Page() {
  const [category, setCategory] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [budgetAmount, setBudgetAmount] = useState<number>(0);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch budgets based on category and month
  const getBudget = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/budget`,
        {
          headers: {
            "category-id": category,
            month: month,
          },
        }
      );
      setBudgets(response.data.data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  // ✅ Fetch transactions
  const getTransactions = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction`
      );
      setTransactions(response.data.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // ✅ Fetch budgets and transactions when filters change
  useEffect(() => {
    if (category || month) {
      getBudget();
      getTransactions();
    }
  }, [category, month]);

  // ✅ Categorize transactions
  const categorizedTransactions: { [category: string]: Transaction[] } = transactions.reduce(
    (acc, transaction) => {
      const categoryName = transaction.categoryId || "Other";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(transaction);
      return acc;
    },
    {} as { [category: string]: Transaction[] }
  );

  // ✅ Create new budget entry
  const createBudget = async () => {
    if (!budgetAmount || !selectedCategory)
      return setError("Budget Amount and Category are required");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/budget`,
        {
          budgetAmount,
          categoryId: selectedCategory,
          month: selectedMonth,
        }
      );
      console.log("Budget Created:", response.data.data);
      getBudget(); // Refresh budgets after adding
    } catch (error) {
      console.error("Error creating budget:", error);
    }
  };

  return (
    <div className="w-full h-full p-4 md:p-6 lg:p-8">
      {/* Filters Section */}
      <div className="w-full flex flex-wrap justify-center gap-4">
        <SelectCategories selectedCategory={setCategory} />
        <SelectMonths selectedMonth={setMonth} />
      </div>

      {/* Chart Section */}
      <div className="w-full h-[400px] md:h-[500px] mt-6">
        <BudgetComparisonChart budgets={budgets} transactions={categorizedTransactions} />
      </div>

      {/* Budget Creation Form */}
      <div className="mt-8  p-4 md:p-6 rounded-lg shadow-lg">
        <h1 className="text-red-500 text-xl md:text-2xl font-bold mb-4 text-center">Create a New Budget</h1>
        
        <form className="flex flex-col space-y-4 items-center">
          <p className="font-bold text-center">Budget</p>
          
          <Input
            id="budget"
            type="number"
            placeholder="Enter budget"
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(parseInt(e.target.value))}
            className="w-full md:w-1/2 lg:w-1/3 text-center"
          />

          <div className="w-full md:w-1/2 lg:w-1/3 flex flex-wrap justify-between gap-4">
            <SelectCategories selectedCategory={setSelectedCategory} />
            <SelectMonths selectedMonth={setSelectedMonth} />
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 text-center">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <PrimaryButton label="Create Budget" onClick={createBudget} />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Page;
