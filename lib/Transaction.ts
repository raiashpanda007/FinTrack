import Response from "@/Utilities/response";
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z as zod } from "zod";

const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"]
});


const addTransactionSchema = zod.object({
    amount: zod.number().positive("Amount must be a positive number"),

    description: zod.string().min(1, "Description cannot be empty"),

    type: zod.enum(["credit", "debit"]),

    categoryId: zod.string().min(1, "Category ID cannot be empty"),

    date: zod.string().refine((val) => {
        const parsedDate = new Date(val);
        const today = new Date();

        
        const formattedDate = parsedDate.toISOString().split("T")[0];
        const formattedToday = today.toISOString().split("T")[0];

        return !isNaN(parsedDate.getTime()) && formattedDate <= formattedToday;
    }, { message: "Invalid date or date cannot be in the future" }),
});


const addTransaction = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const parsedBody = addTransactionSchema.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json(new Response(400, "Invalid request body", { errors: parsedBody.error.format() }), { status: 400 });
        }

        const { amount, description, type, categoryId, date } = parsedBody.data;

        const transaction = await prisma.transaction.create({
            data: {
                amount: Number(amount),
                description,
                type,
                categoryId,
                date: new Date(date),
            },
        });

        return NextResponse.json(new Response(201, "Transaction created successfully", transaction), { status: 201 });

    } catch (error: any) {
        console.error("Error creating transaction:", error);
        return NextResponse.json(new Response(500, "Error in creating the transaction", { error: error.message || error }), { status: 500 });
    }
};
const editTransactionSchema = zod.object({
    id: zod.string().min(1, "Transaction ID cannot be empty"),
    amount: zod.string().refine((val) => {
        const parsedNumber = Number(val);
        return !isNaN(parsedNumber) && parsedNumber > 0;
    }, { message: "Amount must be a positive number" }),

    description: zod.string().min(1, "Description cannot be empty"),

    type: zod.enum(["credit", "debit"]),

    categoryId: zod.string().min(1, "Category ID cannot be empty"),

    date: zod.string().refine((val) => {
        const parsedDate = new Date(val);
        const today = new Date();

        // Convert both dates to YYYY-MM-DD format to ignore time differences
        const formattedDate = parsedDate.toISOString().split("T")[0];
        const formattedToday = today.toISOString().split("T")[0];

        return !isNaN(parsedDate.getTime()) && formattedDate <= formattedToday;
    }, { message: "Invalid date or date cannot be in the future" }),

})
const editTransaction = async (req: NextRequest) => {
    const body = await req.json();
    const parsedBody = editTransactionSchema.safeParse(body);
    if (!parsedBody.success) {
        return NextResponse.json(new Response(400, "Invalid request body", { errors: parsedBody.error }), { status: 400 });
    }
    const { id, amount, description, type, categoryId, date } = parsedBody.data;
    try {
        const transaction = await prisma.transaction.update({
            where: { id: id },
            data: {
                amount: Number(amount),
                description,
                type,
                categoryId,
                date: new Date(date),
            },

        })
        return NextResponse.json(new Response(200, "Transaction updated successfully", transaction), { status: 200 });
    } catch (error) {
        console.error("Error updating transaction:", error);
        return NextResponse.json(new Response(500, "Error in updating the transaction", { error: error }), { status: 500 });

    }
}
const deleteTransactionSchema = zod.object({
    id: zod.string().min(1, "Transaction ID cannot be empty"),
});
const deleteTransaction = async (req: NextRequest) => {
    const body = await req.json();
    const parsedBody = deleteTransactionSchema.safeParse(body);
    if (!parsedBody.success) {
        return NextResponse.json(new Response(400, "Invalid request body", { errors: parsedBody.error }), { status: 400 });
    }
    const { id } = parsedBody.data;
    try {
        await prisma.transaction.delete({
            where: { id: id },
        });
        return NextResponse.json(new Response(200, "Transaction deleted successfully", {}), { status: 200 });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        return NextResponse.json(new Response(500, "Error in deleting the transaction", { error: error }), { status: 500 });
    }
}

const getAllTransactions = async (req: NextRequest) => {
    try {
        const transactions = await prisma.transaction.findMany();
        return NextResponse.json(new Response(200, "Transactions fetched successfully", transactions), { status: 200 });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json(new Response(500, "Error in fetching transactions", { error: error }), { status: 500 });
    }
}
const monthlyTransactions = async (req: NextRequest) => {
    // first get all the transactions
    try {
        const transactions = await prisma.transaction.findMany({
            orderBy: { date: "asc" },
        });
        // sort them according to the date the spent 
        const groupedTransactions = transactions.reduce((acc, transaction) => {
            const date = new Date(transaction.date);
            const year = date.getFullYear();
            const month = date.toLocaleString("default", { month: "long" }); // Convert numeric month to name

            const key = `${month} ${year}`;

            if (!acc[key]) {
                acc[key] = [];
            }

            acc[key].push(transaction);
            return acc;
        }, {} as Record<string, typeof transactions>);

        return NextResponse.json(new Response(200, "Monthly transactions fetched successfully", groupedTransactions));
    } catch (error) {

    }

}

const categoricalTransactions = async (req: NextRequest) => {
    try {
        const transactions = await prisma.transaction.findMany();
        const allCategories = await prisma.category.findMany();

        const groupedTransactions = transactions.reduce((acc, transaction) => {
            // Find category
            const category = allCategories.find((category) => category.id === transaction.categoryId);

            if (!category) {
                console.warn(`Category not found for transaction: ${transaction.id}`);
                return acc;
            }

            // Use category name as key
            if (!acc[category.name]) {
                acc[category.name] = [];
            }

            acc[category.name].push(transaction);
            return acc;
        }, {} as Record<string, typeof transactions>);

        return NextResponse.json(new Response(200, "Categorical transactions fetched successfully", groupedTransactions));
    } catch (error) {
        console.error("Error fetching categorical transactions:", error);
        return NextResponse.json(
            new Response(500, "Error in fetching categorical transactions", { error: error }),
            { status: 500 }
        );
    }
};

const expenses = async (req: NextRequest) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { type: "debit" },
            orderBy: { date: "asc" },
        });

        const monthlyExpenses = transactions.reduce((acc, transaction) => {
            const date = new Date(transaction.date);
            const year = date.getFullYear();
            const month = date.toLocaleString("default", { month: "long" });

            const key = `${month} ${year}`;

            if (!acc[key]) {
                acc[key] = { total: 0, transactions: [] };
            }

            acc[key].transactions.push(transaction);
            acc[key].total += transaction.amount;

            return acc;
        }, {} as Record<string, { total: number; transactions: typeof transactions }>);

        // Calculate overall total
        const overallTotal = Object.values(monthlyExpenses).reduce((sum, month) => sum + month.total, 0);

        return NextResponse.json(
            new Response(200, "Expenses fetched successfully", { monthlyExpenses, overallTotal })
        );
    } catch (error) {
        console.error("Error fetching expenses:", error);
        return NextResponse.json(
            new Response(500, "Error fetching expenses", { error: error }),
            { status: 500 }
        );
    }
};

const earnings = async (req: NextRequest) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { type: "credit" },
            orderBy: { date: "asc" },
        });

        const monthlyExpenses = transactions.reduce((acc, transaction) => {
            const date = new Date(transaction.date);
            const year = date.getFullYear();
            const month = date.toLocaleString("default", { month: "long" });

            const key = `${month} ${year}`;

            if (!acc[key]) {
                acc[key] = { total: 0, transactions: [] };
            }

            acc[key].transactions.push(transaction);
            acc[key].total += transaction.amount;

            return acc;
        }, {} as Record<string, { total: number; transactions: typeof transactions }>);

        // Calculate overall total
        const overallTotal = Object.values(monthlyExpenses).reduce((sum, month) => sum + month.total, 0);

        return NextResponse.json(
            new Response(200, "Expenses fetched successfully", { monthlyExpenses, overallTotal })
        );

    } catch (error) {
        console.error("Error fetching expenses:", error);
        return NextResponse.json(
            new Response(500, "Error fetching expenses", { error: error }),
            { status: 500 }
        );
    }
}



export { addTransaction, editTransaction, deleteTransaction, getAllTransactions, monthlyTransactions, categoricalTransactions, expenses,earnings };
