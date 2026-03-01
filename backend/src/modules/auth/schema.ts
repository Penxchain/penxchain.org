import z from "zod";

export const signupSchema = z.object({
  walletAddress: z.string().trim().min(10, "Invalid wallet address").max(128).optional(),
  username: z.string().trim().min(3).max(32).optional(),
  email: z.string().trim().email().max(254),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  referralCode: z.string().trim().min(3).max(32).optional(),
  deviceId: z.string().trim().min(8).max(128).optional(),
  recaptchaToken: z.string().trim().min(10).max(4096).optional(),
});

export const loginSchema = z
  .object({
    identifier: z.string().trim().min(3).max(254).optional(),
    email: z.string().trim().email().max(254).optional(), // Backward compatibility
    password: z.string().min(1).max(128).optional(),
    walletAddress: z.string().trim().min(10).max(128).optional(),
    signature: z.string().trim().min(10).max(2048).optional(),
    recaptchaToken: z.string().trim().min(10).max(4096).optional(),
  })
  .superRefine((data, ctx) => {
    const hasIdentifier = Boolean(data.identifier || data.email);
    const hasWalletFlow = Boolean(data.walletAddress || data.signature);

    if (!hasIdentifier && !hasWalletFlow) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "identifier/email or wallet credentials are required",
      });
    }

    if (hasIdentifier && !data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "password is required for email/username login",
      });
    }

    if (!hasIdentifier && hasWalletFlow && !(data.walletAddress && data.signature)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "walletAddress and signature must be provided together",
      });
    }
  });

export const checkReferralSchema = z.object({
  code: z.string().trim().min(1).max(32),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
