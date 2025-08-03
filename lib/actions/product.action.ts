'use server'

import { PrismaClient } from "../generated/prisma";

// get latest products
export async function getLatestProducts() {
    const prisma = new PrismaClient();
    const data = await prisma.product.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        take: 4,
    });
    return data;
}
