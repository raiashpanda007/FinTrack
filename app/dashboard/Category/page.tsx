"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import SelectCategories from "@/Components/Landing/SelectCategories";
import TransactionDetails from "@/Components/Dashboard/TransactionDetails";

interface TransactionProps {
  id: string;
  amount: number;
  date: string;
  type: "credit" | "debit";
  description: string;
  category: string;
}

interface CategoryProps {
  id: string;
  name: string;
}

function Page() {
  const [category, setCategory] = useState<string>("");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [transactions, setTransactions] = useState<TransactionProps[]>([]);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/category`
        );
        setCategories(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  // Fetch transactions when category changes
  useEffect(() => {
    if (!category) return;

    const selectedCategory = categories.find((c) => c.id === category);
    setSelectedCategoryName(selectedCategory?.name || "");

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/transaction/filter/category`,
          { withCredentials: true }
        );
        const categoryTransactions = response.data.data[selectedCategory?.name as any]  || [];
        setTransactions(categoryTransactions);
      } catch (err) {
        console.error(err);
        setError("Failed to load transactions.");
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [category, categories]);

  return (
    <div className="w-full h-full p-2">
      <div className="h-[calc(500px)] w-full relative top-5">hi</div>
      <SelectCategories selectedCategory={setCategory} />

      {category && (
        <h1 className="text-2xl">
          Total Expenses for {selectedCategoryName}
        </h1>
      )}

      {loading ? (
        <p>Loading transactions...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        transactions.length > 0 ? (
          transactions.map((transaction) => (
            <TransactionDetails
              key={transaction.id}
              amount={transaction.amount}
              date={transaction.date}
              type={transaction.type}
              description={transaction.description}
              category={transaction.category}
            />
          ))
        ) : (
          <p>No transactions found for this category.</p>
        )
      )}
    </div>
  );
}

export default Page;
