import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Convert Prisma object to a plain object
export function toPlainObject<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

// Format number with decimal places
export function formatNumberWithDecimal(value: number): string {
  const [integerPart, decimalPart] = value.toString().split('.');
  return decimalPart ? `${integerPart}.${decimalPart.padEnd(2, '0')}` : `${integerPart}.00`;
}