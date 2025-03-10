"use client"

import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from "axios"

interface Categoriesprops {
  selectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

interface Categories {
  id: string;
  name: string;
}

function SelectCategories({ selectedCategory }: Categoriesprops) {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/category");
      if (response.data.data) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.log(error);
      setError("Error in fetching the categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      {error ? (
        <div>{error}</div>
      ) : (
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              {categories.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                  onClick={() => selectedCategory(category.id)}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

export default SelectCategories;
