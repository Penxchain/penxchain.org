import z from 'zod';

export const signupSchema = z.object({
  walletAddress: z.string().min(10, 'Invalid wallet address').optional(),
  username: z.string().min(3).optional(),
  email: z.string().email(),
  password: z.string().min(6),
  referralCode: z.string().optional(),
  recaptchaToken: z.string().optional(), // Token from Google ReCaptcha
});

export const loginSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().optional(),
  walletAddress: z.string().min(10).optional(),
  signature: z.string().optional(),
  recaptchaToken: z.string().optional(), // Token from Google ReCaptcha
});

export const checkReferralSchema = z.object({
  code: z.string().min(1),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
