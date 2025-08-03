"use server";

import { prisma } from "@/db/prisma";
import { toPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

// get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: LATEST_PRODUCTS_LIMIT,
  });
  return toPlainObject(data);
}

// Get single product by slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}
