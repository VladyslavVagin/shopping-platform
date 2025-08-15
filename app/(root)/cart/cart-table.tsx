"use client";

import { FC, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowRight, Plus, Minus, Loader } from "lucide-react";
import type { Cart, CartItem } from "@/types";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.action";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { CardContent, Card } from "@/components/ui";
import { Button } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

const CartTable: FC<{ cart?: Cart }> = ({ cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const addToCart = async (item: CartItem) => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(`${item.name} added to cart`, {
        action: {
          label: "Go to Cart",
          onClick: () => router.push("/cart"),
        },
      });
    });
  };

  const removeFromCart = async (item: CartItem) => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(`${item.name} removed from cart`, {
        action: {
          label: "Go to Cart",
          onClick: () => router.push("/cart"),
        },
      });
    });
  };

  return (
    <div>
      <h1 className="h2-bold py-4">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <p>
          Cart is empty. <Link href="/">Go shopping</Link>
        </p>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      <Button
                        disabled={isPending}
                        variant={"outline"}
                        type="button"
                        className="cursor-pointer"
                        onClick={() => removeFromCart(item)}
                      >
                        <Minus className="h-4 w-4" />{" "}
                      </Button>
                      <span>
                        {isPending ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          item.qty
                        )}
                      </span>
                      <Button
                        disabled={isPending}
                        variant={"outline"}
                        type="button"
                        className="cursor-pointer"
                        onClick={() => addToCart(item)}
                      >
                        {" "}
                        <Plus className="h-4 w-4" />{" "}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">{item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className="p-4 gap-4">
              <div className="pb-3 text-xl">
                Subtotal ({cart.items.reduce((acc, item) => acc + item.qty, 0)}
                ):
                <span className="font-bold">
                  {" "}
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>
              <Button
                className="w-full cursor-pointer"
                disabled={isPending}
                onClick={() =>
                  startTransition(() => router.push("/shipping-address"))
                }
              >
                {isPending ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CartTable;
