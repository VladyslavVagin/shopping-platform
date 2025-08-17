"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { CartItem } from "@/types";
import { FormatError, toPlainObject, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";

// Calculate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get cart
    const cart = await getMyCart();

    // Parse and validate item
    const item = cartItemSchema.parse(data);

    // Find prodiuct in database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error("Product not found");
    console.log({
      ...calcPrice([item]),
      items: [item],
    });

    if (!cart) {
      // Create new cart if none exists
      const newCart = insertCartSchema.parse({
        userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });
      await prisma.cart.create({
        data: newCart,
      });

      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: "Item added to cart",
      };
    } else {
      // Update existing cart
      const existingItems = Array.isArray(cart.items)
        ? (cart.items as CartItem[])
        : [];
      const existingItemIndex = existingItems.findIndex(
        (cartItem) => cartItem.productId === item.productId
      );

      let updatedItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        updatedItems = existingItems.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, qty: cartItem.qty + item.qty }
            : cartItem
        );
      } else {
        // Item doesn't exist, add it
        updatedItems = [...existingItems, item];
      }

      // Recalculate prices
      const updatedPrices = calcPrice(updatedItems);

      // Update cart in database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: updatedItems,
          itemsPrice: updatedPrices.itemsPrice,
          shippingPrice: updatedPrices.shippingPrice,
          taxPrice: updatedPrices.taxPrice,
          totalPrice: updatedPrices.totalPrice,
        },
      });

      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: "Item added to cart",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: FormatError(error),
    };
  }
}

export async function getMyCart() {
  // Check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");

  // Get session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get user cart from database
  const cart = await prisma?.cart?.findFirst({
    where: userId ? { userId: userId } : { sessionCartId },
  });
  console.log("CARt", cart);
  if (!cart) return undefined;

  return toPlainObject({
    ...cart,
    items: cart?.items as CartItem[],
    itemsPrice: cart?.itemsPrice.toString(),
    totalPrice: cart?.totalPrice.toString(),
    shippingPrice: cart?.shippingPrice.toString(),
    taxPrice: cart?.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");

    const exist = (cart.items as CartItem[]).find(x => x.productId === productId);
    if(!exist) throw new Error("Item not found in cart");

    if(exist.qty === 1) {
      // Remove from cart
      cart.items = (cart.items as CartItem[]).filter(x => x.productId !== exist.productId);
    } else {
      //Decrease qty
      (cart.items as CartItem[]).find(x => x.productId === productId)!.qty = exist.qty - 1;
    }

    // Update Cart in database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items,
        itemsPrice: calcPrice(cart.items).itemsPrice,
        shippingPrice: calcPrice(cart.items).shippingPrice,
        taxPrice: calcPrice(cart.items).taxPrice,
        totalPrice: calcPrice(cart.items).totalPrice,
      },
    });

    revalidatePath(`/product/${product.slug}`);
    return {
      success: true,
      message: "Item removed from cart",
    };
  } catch (error) {
    return {
      success: false,
      message: FormatError(error),
    };
  }
}
