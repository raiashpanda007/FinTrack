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

function CreateTransaction() {
  const [amount, setAmount] = useState<number | undefined>();
  const [description, setDescription] = useState("");
  const [category,setCategory] = useState("");

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
          />
        </div>

        {/* Footer with buttons stacked on mobile, side-by-side on larger screens */}
        <AlertDialogFooter className="mt-6 flex flex-col sm:flex-row gap-3 w-full">
          <AlertDialogCancel className="w-full sm:w-auto">
            Cancel
          </AlertDialogCancel>

          {/* Use asChild to avoid nested buttons */}
          <AlertDialogAction asChild>
            <PrimaryButton
              label="Add Transaction"
              onClick={() => console.log("Clicked")}
            />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CreateTransaction;
