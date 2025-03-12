"use client";
import SelectCategories from "@/Components/Landing/SelectCategories";
import SelectMonths from "@/Components/Dashboard/SelectMonth";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import PrimaryButton from "@/Components/PrimaryButton";
import { set } from "date-fns";
interface Transactions {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  type: string;
}

function page() {
  const [category, setCategory] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [budgetAmount, setBudgetAmount] = useState<number>(0);
  const [categoricalTransaction, setCategoricalTransactions] = useState<
    Transactions[]
  >([]);
  const [monthlyTransaction, setMonthlyTransactions] = useState<Transactions[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const createBudget = async () => {
    if(!budgetAmount || !selectedCategory) return setError('Budget Amount and Category are required') 
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/budget`,
        {
          budgetAmount,
          categoryId: selectedCategory,
          month: selectedMonth,
        }
      );
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
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
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const categoricalTransactions = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction`
      );
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const monthlyTransactions = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction`
      );
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBudget();
  }, [category, month]);
  return (
    <div className="w-full h-full p-2">
      <div className="w-full flex justify-evenly">
        <SelectCategories selectedCategory={setCategory} />
        <SelectMonths selectedMonth={setMonth} />
      </div>
      <div className='h-[calc(500px)] w-full relative top-5 z-[-10]"'>hi</div>

      <div>
        <h1 className="text-red-500 text-2xl font-extrabold">
          Create a new budget
        </h1>
        <form className="flex flex-col space-y-4">
          <p className="font-bold">Budget</p>
          <Input
            id="budget"
            type="number"
            placeholder="Enter budget"
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(parseInt(e.target.value))}
            className="w-1/3"
          />
          <div className="w-1/3 flex justify-between">
            <SelectCategories selectedCategory={setSelectedCategory} />
            <SelectMonths selectedMonth={setSelectedMonth} />
          </div>
          <div className="w-1/3">
            <PrimaryButton label="Create Budget" onClick={createBudget}/>
          </div>
        </form>
      </div>
    </div>
  );
}

export default page;
