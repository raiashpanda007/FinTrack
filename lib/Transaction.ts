import Response from "@/Utilities/response";
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z as zod } from "zod";
const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"]
});

const addTransactionSchema = zod.object({
    amount: zod.number().positive(),
    description: zod.string().nonempty(),
    type: zod.enum(["credit", "debit"]),
    categoryId: zod.string().nonempty(),
    date: zod.string().refine((val) => {
        const parsedDate = new Date(val);
        const today = new Date();
        
        // Ensure it's a valid date and not in the future
        return !isNaN(parsedDate.getTime()) && parsedDate <= today;
    }, {
        message: "Invalid date or date cannot be in the future"
    })
});


const addTransaction = async (req: NextRequest) => {
    const body = await req.json();
    const parsedBody = addTransactionSchema.safeParse(body);
    if (!parsedBody.success) {
        return NextResponse.json(new Response(400, "Invalid request body", { error: parsedBody.error }), { status: 400 })
    }
    const { amount, description, type, categoryId ,date} = parsedBody.data;
    try {
        const transaction = await prisma.transaction.create({
            data: {
                amount,
                description,
                type,
                date,
                categoryId
            }
        });
        return NextResponse.json(new Response(201, "Transaction created successfully", transaction), { status: 201 })
    } catch (error) {
        return NextResponse.json(new Response(500, "Error in creating the transaction", { error }), { status: 500 })
    }
}