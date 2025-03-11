import React from 'react';

interface  TransactionProps {
  amount: number;
  date: string;
  type: 'credit' | 'debit';
  description: string;
  category: string;
};

function TransactionDetails({ amount, date, type, description, category }: TransactionProps) {
  return (
    <div className="flex justify-between items-center m-4 hover:border cursor-pointer rounded-sm h-20 p-2 border-gray-200">
      <div>
        <p className="text-lg font-medium">{description}</p>
        <p className="text-sm text-gray-500">{category} • {new Date(date).toLocaleDateString()}</p>
      </div>
      <p className={`text-lg font-semibold ${type === 'debit' ? 'text-red-500' : 'text-green-500'}`}>
        {type === 'debit' ? '-' : '+'}${amount}
      </p>
    </div>
  );
}

export default TransactionDetails;
