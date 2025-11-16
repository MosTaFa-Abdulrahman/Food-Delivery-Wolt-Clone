import { z } from "zod";

// Create
export const createRestaurantSchema = z.object({
  name: z
    .string()
    .min(1, "Restaurant name is required")
    .max(200, "Name must not exceed 200 characters"),

  description: z.string().optional(),

  imgUrl: z.string().url({ message: "Invalid image URL" }).or(z.literal("")),

  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address must not exceed 200 characters"),

  city: z
    .string()
    .min(1, "City is required")
    .max(90, "City must not exceed 90 characters"),

  phoneNumber: z.string().optional(),

  rating: z
    .number()
    .min(0, "Rating cannot be negative")
    .max(5, "Rating cannot exceed 5")
    .optional(),

  deliveryTime: z
    .string()
    .min(1, "Delivery time is required")
    .regex(/^\d+-\d+\smin$/, "Format should be like '15-25 min'"),

  deliveryFee: z.number().min(0, "Delivery fee cannot be negative").optional(),

  minOrder: z.number().min(0, "Minimum order cannot be negative").optional(),

  isActive: z.boolean().optional(),
});

// Update
export const updateRestaurantSchema = z.object({
  name: z.string().max(200, "Name must not exceed 200 characters").optional(),

  description: z.string().optional(),

  imgUrl: z
    .string()
    .url({ message: "Invalid image URL" })
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .max(200, "Address must not exceed 200 characters")
    .optional(),

  city: z.string().max(90, "City must not exceed 90 characters").optional(),

  phoneNumber: z.string().optional(),

  rating: z
    .number()
    .min(0, "Rating cannot be negative")
    .max(5, "Rating cannot exceed 5")
    .optional(),

  deliveryTime: z
    .string()
    .regex(/^\d+-\d+\smin$/, "Format should be like '15-25 min'")
    .optional(),

  deliveryFee: z.number().min(0, "Delivery fee cannot be negative").optional(),

  minOrder: z.number().min(0, "Minimum order cannot be negative").optional(),

  isActive: z.boolean().optional(),
});
