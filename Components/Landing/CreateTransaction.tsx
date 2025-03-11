"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import PrimaryButton from "../PrimaryButton";
import CreateTransactionForm from "./CreateTransForm";
import axios from "axios";
import { useRouter } from "next/navigation";

function CreateTransaction() {
  const router = useRouter()


  const [amount, setAmount] = useState<number | undefined>();
  const [description, setDescription] = useState("");
  const [category,setCategory] = useState("");
  const [type,setType] = useState("credit");
  const [transDate, setTransDate] = useState<Date | undefined>();
  const [error , setError] = useState<string | null>(null);


  const CreateTransaction = async () => {
    if (!amount || !description || !category || !transDate) {
      setError("All fields are required");
      return;
    }
  
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction`,
        {
          amount,
          description,
          categoryId: category,
          date: transDate,
          type,
        },
        { withCredentials: true }
      );
      router.push("/dashboard");
  
      console.log(response);
    } catch (error) {
      console.error(error);
  
      // Type assertion for Axios errors
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "An unexpected error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };
    
  
  return (
    <AlertDialog>
      {/* Trigger asChild so we don't nest a button inside a button */}
      <AlertDialogTrigger asChild>
        <PrimaryButton label="Add transaction" />
      </AlertDialogTrigger>

      {/* Make the content responsive with max-w and padding */}
      <AlertDialogContent className="w-full max-w-md mx-auto p-4 sm:p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl sm:text-3xl font-extrabold text-red-500">
            Create a transaction
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-sm sm:text-base text-gray-500">
            Take control of your finances with ease! Create a user profile and start tracking your
            income, expenses, and budgets—all in one simple dashboard. Get real-time insights into
            your spending habits and make informed financial decisions.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-4">
          <CreateTransactionForm
            amount={amount}
            description={description}
            setAmount={setAmount}
            setDescription={setDescription}
            setCategory={setCategory}
            setTransDate={setTransDate}
            setType={setType}
          />
        </div>

        {/* Footer with buttons stacked on mobile, side-by-side on larger screens */}
        <AlertDialogFooter className="mt-6 flex flex-col sm:flex-row gap-3 w-full">
          {error && <p className="text-red-500 text-sm sm:text-base">
            {error}
          </p>}
          <AlertDialogCancel className="w-full sm:w-auto">
            Cancel
          </AlertDialogCancel>

          {/* Use asChild to avoid nested buttons */}
          <AlertDialogAction asChild>
            <PrimaryButton
              label="Add Transaction"
              onClick={CreateTransaction}
            />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CreateTransaction;
