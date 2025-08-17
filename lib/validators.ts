import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";

const currency = z.string().refine(value => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(+value)), "Currency must be a valid number with two decimal places");

// Schema for inserting a product
export const insertProductShema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  slug: z.string().min(3, "Slug must be at least 3 characters long"),
  category: z.string().min(3, "Category must be at least 3 characters long"),
  brand: z.string().min(3, "Brand must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

// Sign Up schema
export const signUpFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

// Schema for signing in user
export const signInFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Cart schema
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  slug: z.string().min(2, "Slug must be at least 2 characters long"),
  qty: z.number().int().nonnegative("Quantity must be a non-negative integer"),
  image: z.string().min(2, "Image URL must be at least 2 characters long"),
  price: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session Cart ID is required"),
  userId: z.string().optional().nullable(),
});

// Schema shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters long"),
  streetAddress: z.string().min(3, "Street address must be at least 3 characters long"),
  city: z.string().min(2, "City must be at least 2 characters long"),
  postalCode: z.string().min(5, "Zip code must be at least 5 characters long"),
  country: z.string().min(2, "Country must be at least 2 characters long"),
  lat: z.number().optional(),
  lng: z.number().optional(),
})

// Schema for payment method
export const paymentMethodSchema = z.object({
  type: z.string().min(1, "Payment method type is required"),
}).refine(data => PAYMENT_METHODS.includes(data.type), {
  message: "Invalid payment method",
  path: ["type"],
});

// Schema for inserting order
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  itemsPrice: currency,
  shippingPrice: currency,
  totalPrice: currency,
  taxPrice: currency,
  paymentMethod: z.string().refine(data => PAYMENT_METHODS.includes(data), {
    message: "Invalid payment method"
  }),
  shippingAddress: shippingAddressSchema
})

// Schema for inserting an order item
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number()
})