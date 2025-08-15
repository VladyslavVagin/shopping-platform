import { z } from "zod";
import { insertProductShema, insertCartSchema, cartItemSchema, shippingAddressSchema } from "@/lib/validators";

export type Product = z.infer<typeof insertProductShema> & {
    id: string;
    rating: string;
    createdAt: Date;
};

export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof insertCartSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;