"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MonthsProps {
  selectedMonth: React.Dispatch<React.SetStateAction<string>>;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function SelectMonths({ selectedMonth }: MonthsProps) {
  return (
    <Select
      onValueChange={(value) => {
        selectedMonth(value);
        console.log(value);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a month" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Months</SelectLabel>
          {months.map((month) => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectMonths;
