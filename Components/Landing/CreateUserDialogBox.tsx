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
import CreateUserForm from "./CreateUserForm";

function CreateUserDialogBox() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <AlertDialog>
      {/* Trigger asChild so we don't nest a button inside a button */}
      <AlertDialogTrigger asChild>
        <PrimaryButton label="Create User" />
      </AlertDialogTrigger>

      {/* Make the content responsive with max-w and padding */}
      <AlertDialogContent className="w-full max-w-md mx-auto p-4 sm:p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl sm:text-3xl font-extrabold text-red-500">
            Create a user
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-sm sm:text-base text-gray-500">
            Take control of your finances with ease! Create a user profile and start tracking your
            income, expenses, and budgets—all in one simple dashboard. Get real-time insights into
            your spending habits and make informed financial decisions.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-4">
          <CreateUserForm
            name={name}
            email={email}
            setName={setName}
            setEmail={setEmail}
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
              label="Create User"
              onClick={() => console.log("Clicked")}
            />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CreateUserDialogBox;
