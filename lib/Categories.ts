import Response from "@/Utilities/response";
import { NextResponse,NextRequest } from "next/server";
import {PrismaClient} from "@prisma/client";
import {z as zod} from "zod";
const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"]
  });
  

const getCategories = async () => {
    try {
        const categories = await prisma.category.findMany();
        console.log(categories)
        return NextResponse.json(new Response(200, "Categories fetched successfully", categories),{status:200})
    } catch (error) {
        return NextResponse.json(new Response(500, "Error in fetching the categories", {error}),{status:500})
    }
}
const createCategorySchema = zod.object({
    name: zod.string().nonempty()
});
const createCategory = async (req: NextRequest) => {
    const body = await req.json();
    const parsedBody = createCategorySchema.safeParse(body);
    if (!parsedBody.success) {
        return NextResponse.json(new Response(400, "Invalid request body", {error: parsedBody.error}),{status:400})
    }
    const {name} = parsedBody.data;
    try {
        const category = await prisma.category.create({
            data: {
                name
            }
        });
        return NextResponse.json(new Response(201, "Category created successfully", category),{status:201})
    } catch (error) {
        return NextResponse.json(new Response(500, "Error in creating the category", {error}),{status:500})
    }
}


export {
    getCategories,
    createCategory
}