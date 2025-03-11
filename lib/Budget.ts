import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z as zod } from "zod";
import Response  from "@/Utilities/response";

const prisma = new PrismaClient()
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
  return Object.values(Month)[now.getMonth()]; // Maps 0-11 to Month enum
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
  month: zod.nativeEnum(Month).default(getCurrentMonth()), // Ensure it's an enum value
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
      return NextResponse.json(new Response(404, "Category not found",{}), { status: 404 });
    }

    // Upsert (Update if exists, otherwise create)
    const budget = await prisma.budget.upsert({
      where: { categoryId_month: { categoryId, month } },
      update: { amount: budgetAmount },
      create: { categoryId, amount: budgetAmount, month },
    });

    return NextResponse.json(new Response(200, "Budget set successfully", budget));
  } catch (error) {
    console.error("Error setting monthly category budget:", error);
    return NextResponse.json(new Response(500, "Internal Server Error", { error  }), { status: 500 });
  }
};

export {setMonthlyCategoryBudget}
