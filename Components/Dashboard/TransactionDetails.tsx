import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SelectCategories from "../Landing/SelectCategories";
import { DatePickerDemo } from "../Landing/DatePicker";
import axios from "axios";
import { useRouter } from "next/navigation";

interface TransactionProps {
  id: string;
  amount: number;
  date: string;
  type: 'credit' | 'debit';
  description: string;
  category: string;
}

function TransactionDropdown({ transaction }: { transaction: TransactionProps }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [amount, setAmount] = useState(transaction.amount);
  const [description, setDescription] = useState(transaction.description);
  const [category, setCategory] = useState(transaction.category);
  const [type, setType] = useState(transaction.type);
  const [transDate, setTransDate] = useState<Date | undefined>(new Date(transaction.date));
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEditTransaction = async () => {
    if (!amount || !description || !category || !transDate) {
      setError("All fields are required");
      return;
    }
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/transaction`, {
        id: transaction.id,
        amount,
        description,
        category,
        type,
        date: transDate,
      });
      router.refresh();
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating transaction:", error);
      setError("Failed to update transaction");
    }
  };

  const handleDeleteTransaction = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/transaction`, {
        data: { id: transaction.id },
      });
      router.push('/dashboard/Transaction');
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setError("Failed to delete transaction");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">⋮</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDeleteTransaction}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Transaction</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4">
            <Label>Amount</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />

            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />

            <Label>Category</Label>
            <SelectCategories selectedCategory={setCategory} />

            <Label>Date</Label>
            <DatePickerDemo selectedDate={setTransDate} />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleEditTransaction}>Save Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function TransactionDetails({ id, amount, date, type, description, category }: TransactionProps) {
  return (
    <div className="flex justify-between items-center m-4 hover:border cursor-pointer rounded-sm h-20 p-2 border-gray-200">
      <div>
        <p className="text-lg font-medium">{description}</p>
        <p className="text-sm text-gray-500">{category} • {new Date(date).toLocaleDateString()}</p>
      </div>
      <div className="flex items-center gap-4">
        <p className={`text-lg font-semibold ${type === 'debit' ? 'text-red-500' : 'text-green-500'}`}>
          {type === 'debit' ? '-' : '+'}${amount}
        </p>
        <TransactionDropdown transaction={{ id, amount, date, type, description, category }} />
      </div>
    </div>
  );
}

export default TransactionDetails;
