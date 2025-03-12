"use client"
import { useEffect,useState } from "react";
import CreateTransaction from "@/Components/Landing/CreateTransaction";
import axios from "axios";
import TransactionDetails from "@/Components/Dashboard/TransactionDetails";
import MonthlyExpensesChart from "@/Components/Dashboard/MonthlyCharts";
interface  TransactionProps {
    id:string
    amount: number;
    date: string;
    type: 'credit' | 'debit';
    description: string;
    category: string;
  };

  interface ExpensesProps {
    overallTotal: number;

  }
function page() {

    const [transactions, setTransactions] = useState<TransactionProps[]>([]);
    const [expenses, setExpenses] = useState<ExpensesProps>();
    const [earnings, setEarnings] = useState<ExpensesProps>();
    const [selectYears, setSelectYears] = useState<string>("");
    const getTransactions = async () => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transaction`, {
            withCredentials: true,
        });
        console.log(response);
        setTransactions(response.data.data);
        } catch (error) {
        console.error(error);
        }
    };
    const getExpenses = async() => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/debits`, {
                withCredentials: true,
            });
            console.log(response);
            setExpenses(response.data.data);
        } catch (error) {
            console.error(error);
        }
    }
    const getEarnings = async() => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/credits`, {
                withCredentials: true,
            });
            console.log(response);
            setEarnings(response.data.data);
        }
        catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getTransactions();
        getExpenses();
        getEarnings();
    }
    , []);
  return (
    <div className="w-full h-full p-2">
      <div className="ml-10">
      <CreateTransaction />
      </div>
      <div className="h-[calc(500px)] w-full ">
        <MonthlyExpensesChart />
      </div>
      <div className="w-full h-32 border rounded-2xl flex">
        <div className="h-full w-1/2 p-2 border-r flex flex-col justify-evenly items-center">
          <h1 className="text-4xl font-extrabold  ">Total Debit </h1>
          <p className="text-2xl font-bold text-red-500">
            ${expenses && expenses.overallTotal}
          </p>
        </div>
        <div className="h-full w-1/2 p-2 flex flex-col justify-evenly items-center">
          <h1 className="text-4xl font-extrabold text-red-500 ">Total Credit </h1>
          <p className="text-2xl font-bold ">
            ${earnings && earnings.overallTotal}
          </p>
        </div>
       
      </div>
      <h1 className="text-4xl font-extrabold ">
        Latest Transactions
      </h1>
      {
        transactions.map((transaction) => (
          <TransactionDetails
            key={transaction.id}
            id={transaction.id}
            amount={transaction.amount}
            date={transaction.date}
            type={transaction.type}
            description={transaction.description}
            category={transaction.category}
          />
        ))

      }


    </div>
  );
}

export default page;
