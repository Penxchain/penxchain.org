import z from 'zod';

export const leaderboardQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50).optional(),
});
