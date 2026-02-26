import { z } from 'zod';

export const createOrderSchema = z.object({
  walletAddress: z.string().min(40, "Invalid wallet address"), // Basic length check
  usdtAmount: z.number().positive("Amount must be positive"),
  txHash: z.string().min(10, "Transaction Hash is required"),
  userId: z.string().uuid().optional(),
});

export const confirmOrderSchema = z.object({
  orderId: z.string().uuid(),
});

export const createOrderResponseSchema = z.object({
  success: z.boolean(),
  orderId: z.string(),
  message: z.string(),
});

export const getStatsResponseSchema = z.object({
  totalRaised: z.number(),
  participants: z.number(),
  softCap: z.number(),
  hardCap: z.number(),
  progressPercentage: z.number(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
