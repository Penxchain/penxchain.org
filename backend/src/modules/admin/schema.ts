import z from 'zod';

export const querySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
  search: z.string().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  type: z.enum(['SOCIAL', 'DAILY', 'ONE_TIME']),
  points: z.number().int().positive(),
  link: z.string().url().optional().or(z.literal('')),
  icon: z.string().optional(),
  category: z.string().optional().default('engagement'),
  validationKey: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  durationDays: z.number().int().min(1).max(30).optional(), // For SOCIAL tasks: 1-30 days
});

export const updateTaskSchema = createTaskSchema.partial();

export const updateUserPxpSchema = z.object({
  amount: z.number().int().positive(),
  action: z.enum(['add', 'subtract', 'set']),
}); // userId is in params

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateUserPxpInput = z.infer<typeof updateUserPxpSchema>;
