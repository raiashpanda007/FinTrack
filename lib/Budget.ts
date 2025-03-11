import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z as zod } from "zod";
import Response from "@/Utilities/response";

const prisma = new PrismaClient();

// Define the Month enum
enum Month {
    JANUARY = "JANUARY",
    FEBRUARY = "FEBRUARY",
    MARCH = "MARCH",
    APRIL = "APRIL",
    MAY = "MAY",
    JUNE = "JUNE",
    JULY = "JULY",
    AUGUST = "AUGUST",
    SEPTEMBER = "SEPTEMBER",
    OCTOBER = "OCTOBER",
    NOVEMBER = "NOVEMBER",
    DECEMBER = "DECEMBER",
}

// Helper function to get the current month in `Month` enum format
const getCurrentMonth = (): Month => {
    const now = new Date();
    return Object.values(Month)[now.getMonth()];
};

// Zod schema to validate the request
const setMonthlyCategoryBudgetSchema = zod.object({
    categoryId: zod.string(),
    budgetAmount: zod.string().transform((val) => {
        const num = Number(val);
        if (isNaN(num) || num <= 0) {
            throw new Error("Budget amount must be a positive number");
        }
        return num;
    }),
    month: zod.nativeEnum(Month).default(() => getCurrentMonth()), // Dynamically gets the current month
});

const setMonthlyCategoryBudget = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const parsedBody = setMonthlyCategoryBudgetSchema.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json(new Response(400, "Invalid data", parsedBody.error.errors), { status: 400 });
        }

        const { categoryId, budgetAmount, month } = parsedBody.data;

        // Check if category exists
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!category) {
            return NextResponse.json(new Response(404, "Category not found", {}), { status: 404 });
        }

        // Upsert (Update if exists, otherwise create)
        const budget = await prisma.budget.upsert({
            where: { categoryId_month: { categoryId, month } }, // Corrected unique constraint reference
            update: { amount: budgetAmount },
            create: { categoryId, amount: budgetAmount, month },
        });

        return NextResponse.json(new Response(200, "Budget set successfully", budget));
    } catch (error) {
        console.error("Error setting monthly category budget:", error);
        return NextResponse.json(new Response(500, "Internal Server Error", { error }), { status: 500 });
    }
};

// Zod schema for fetching budgets
const getBudgetMonthSchema = zod.object({
    month: zod.nativeEnum(Month).default(() => getCurrentMonth()), // Dynamically gets current month
    categoryId: zod.string().optional(),
});
const getBudgetsMonth = async (req: NextRequest) => {
    try {
        const monthHeader = req.headers.get("month"); // Custom header for month
        const categoryIdHeader = req.headers.get("category-id"); // Custom header for categoryId

        const month = (monthHeader as Month) || getCurrentMonth();
        const categoryId = categoryIdHeader || undefined;

        try {
            // Query based on filters
            const budgets = await prisma.budget.findMany({
                where: {
                    ...(categoryId ? { categoryId } : { month }), // If categoryId exists, filter by it; otherwise, use month
                },
            });

            return NextResponse.json(new Response(200, "Budgets fetched successfully", budgets));
        } catch (error) {
            console.error("Error fetching budgets:", error);
            return NextResponse.json(new Response(500, "Error fetching budgets", { error }), { status: 500 });
        }
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(new Response(500, "Internal Server Error", { error }), { status: 500 });
    }
};


export { setMonthlyCategoryBudget, getBudgetsMonth };
