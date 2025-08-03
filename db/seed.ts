import { PrismaClient } from "../lib/generated/prisma";
import sampleData from "./sample-data";

const prisma = new PrismaClient();

async function main () {
    // Clear existing data
    await prisma.product.deleteMany();
    // Create sample products
    await prisma.product.createMany({
        data: sampleData.products,
    });
}

main();