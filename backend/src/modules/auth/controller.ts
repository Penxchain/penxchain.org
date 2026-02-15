import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, loginUser, checkReferralCode } from "./service";
import { SignupInput, LoginInput } from "./schema";
import { AppError, BadRequestError } from "../../shared/errors";
import { verifyRecaptcha, RECAPTCHA_MIN_SCORE } from "../../shared/recaptcha";

export async function signupHandler(
  request: FastifyRequest<{ Body: SignupInput }>,
  reply: FastifyReply,
) {
  try {
    // 1. Verify ReCaptcha if token provided
    if (request.body.recaptchaToken) {
      const { success, score, error } = await verifyRecaptcha(request.body.recaptchaToken, 'signup');
      if (!success || score < RECAPTCHA_MIN_SCORE) {
        throw new BadRequestError(error || "Security verification failed. Please try again.");
      }
    }

    const user = await createUser(request.body);
    const token = request.server.jwt.sign({ id: user.id, role: user.role, tokenVersion: 0 });
    // Do not send password hash back to the client
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user as any;
    return reply.status(201).send({ success: true, ...safeUser, token });
  } catch (error: any) {
    // AppError types are handled by the global error handler
    // Just rethrow them
    throw error;
  }
}

export async function checkReferralHandler(
  request: FastifyRequest<{ Querystring: { code: string } }>,
  reply: FastifyReply,
) {
  const { code } = request.query;
  if (!code) return reply.status(400).send({ success: false, valid: false, message: "Code required" });
  
  const isValid = await checkReferralCode(code);
  return reply.send({ success: true, valid: isValid });
}

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply,
) {
  try {


    const user = await loginUser(request.body);
    const token = request.server.jwt.sign({ id: user.id, role: user.role, tokenVersion: (user as any).tokenVersion || 0 });
    // Omit password hash from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user as any;
    return reply.status(200).send({ success: true, ...safeUser, token });
  } catch (error: any) {
    // AppError types are handled by the global error handler
    throw error;
  }
}

