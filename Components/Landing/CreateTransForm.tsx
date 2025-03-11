import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React from "react";
import { Select } from "@/components/ui/select";
import SelectCategories from "./SelectCategories";
import { DatePickerDemo } from "./DatePicker";
interface CreateTransFormProps {
  amount: number | undefined;
  description: string;
  setAmount: React.Dispatch<React.SetStateAction<number | undefined>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  setTransDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setType:React.Dispatch<React.SetStateAction<string>>;
}
function CreateTransForm({
  amount,
  description,
  setAmount,
  setDescription,
  setCategory,
  setTransDate,
  setType
}: CreateTransFormProps) {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Type of Transaction </Label>
        <RadioGroup defaultValue="credit">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="credit" id="credit" className="border-red-500 cursor-pointer" />
            <Label htmlFor="credit">Credit</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="debit" id="debit" className="border-red-500 cursor-pointer" />
            <Label htmlFor="debit">Debit</Label>
          </div>
          
        </RadioGroup>
      </div>
      <div className="space-y-1">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          value={amount}
          type="number"
        
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter the transaction amount"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a description"
        />
      </div>
      <SelectCategories selectedCategory={setCategory} />
      <DatePickerDemo selectedDate={setTransDate} />

    </form>
  );
}

export default CreateTransForm;
