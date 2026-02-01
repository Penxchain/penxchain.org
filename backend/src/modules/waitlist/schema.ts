import z from 'zod';

export const completeTaskSchema = z.object({
  taskId: z.string().uuid(),
  // For validation (e.g., link to tweet)
  proof: z.string().optional(),
});

export const getTasksQuerySchema = z.object({
  // No query params for now, maybe type filter later
});

export const claimBonusSchema = z.object({
  // No body needed as we track lastClaim in DB, 
  // but we can add verification here later.
});

export type CompleteTaskInput = z.infer<typeof completeTaskSchema>;
export type ClaimBonusInput = z.infer<typeof claimBonusSchema>;
