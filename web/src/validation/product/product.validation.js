import { z } from "zod";

// Create Product Schema
export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Name must not exceed 200 characters"),

  description: z.string().optional(),

  quantity: z
    .number({ required_error: "Quantity is required" })
    .min(0, "Quantity cannot be negative"),

  price: z
    .number({ required_error: "Price is required" })
    .min(0, "Price cannot be negative"),

  imgUrl: z.string().url({ message: "Invalid image URL" }).or(z.literal("")),

  isAvailable: z.boolean().optional(),

  restaurantId: z.string().min(1, "Restaurant is required"),

  // Make categoryId optional - we'll handle validation manually in the component
  categoryId: z.string().optional(),
});

// Update Product Schema
export const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name cannot be empty")
    .max(200, "Name must not exceed 200 characters")
    .optional(),

  description: z.string().optional(),

  quantity: z.number().min(0, "Quantity cannot be negative").optional(),

  price: z.number().min(0, "Price cannot be negative").optional(),

  imgUrl: z
    .string()
    .url({ message: "Invalid image URL" })
    .optional()
    .or(z.literal("")),

  isAvailable: z.boolean().optional(),

  restaurantId: z.string().optional(),

  categoryId: z.string().optional(),
});

// Toggle Favourite Schema
export const toggleFavouriteSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});
