import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, loginUser, checkReferralCode } from "./service";
import { SignupInput, LoginInput } from "./schema";
import { BadRequestError } from "../../shared/errors";
import {
  issueRefreshToken,
  readRefreshCookie,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeAllUserSessions,
  setRefreshCookie,
  clearRefreshCookie,
} from "./session";
import { requireActiveUser } from "../../shared/middleware";

function asHeaderString(value: unknown) {
  if (Array.isArray(value)) return value[0];
  return typeof value === "string" ? value : undefined;
}

export async function signupHandler(
  request: FastifyRequest<{ Body: SignupInput }>,
  reply: FastifyReply,
) {
  const user = await createUser(request.body, {
    ip: request.ip,
    userAgent: asHeaderString(request.headers["user-agent"]),
    headers: request.headers as Record<string, unknown>,
    deviceId: request.body.deviceId,
  });
  const token = request.server.jwt.sign({
    id: user.id,
    role: user.role,
    tokenVersion: user.tokenVersion,
  });
  const refreshSession = await issueRefreshToken(user.id, user.tokenVersion, {
    ip: request.ip,
    userAgent: asHeaderString(request.headers["user-agent"]),
    headers: request.headers as Record<string, unknown>,
  });
  setRefreshCookie(reply, refreshSession.rawToken);

  // Never expose password hashes or internal reward flags.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, newUserBonusGranted, ...safeUser } = user as any;

  return reply.status(201).send({
    success: true,
    ...safeUser,
    token,
  });
}

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply,
) {
  const user = await loginUser(request.body, {
    ip: request.ip,
    userAgent: asHeaderString(request.headers["user-agent"]),
    headers: request.headers as Record<string, unknown>,
    deviceId: asHeaderString(request.headers["x-device-id"]),
  });
  const token = request.server.jwt.sign({
    id: user.id,
    role: user.role,
    tokenVersion: user.tokenVersion,
  });
  const refreshSession = await issueRefreshToken(user.id, user.tokenVersion, {
    ip: request.ip,
    userAgent: asHeaderString(request.headers["user-agent"]),
    headers: request.headers as Record<string, unknown>,
  });
  setRefreshCookie(reply, refreshSession.rawToken);

  // Do not expose password hashes over the wire.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...safeUser } = user as any;

  return reply.status(200).send({
    success: true,
    ...safeUser,
    token,
  });
}

export async function checkReferralHandler(
  request: FastifyRequest<{ Querystring: { code: string } }>,
  reply: FastifyReply,
) {
  const { code } = request.query;
  if (!code) throw new BadRequestError("Code required");

  const isValid = await checkReferralCode(code);
  return reply.send({ success: true, valid: isValid });
}

export async function refreshSessionHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const refreshToken = readRefreshCookie(request);
  if (!refreshToken) {
    throw new BadRequestError("No refresh session found.");
  }

  const rotated = await rotateRefreshToken(refreshToken, {
    ip: request.ip,
    userAgent: asHeaderString(request.headers["user-agent"]),
    headers: request.headers as Record<string, unknown>,
  });
  setRefreshCookie(reply, rotated.rawRefreshToken);

  const token = request.server.jwt.sign({
    id: rotated.userId,
    role: rotated.role,
    tokenVersion: rotated.tokenVersion,
  });

  return reply.send({ success: true, token });
}

export async function logoutHandler(request: FastifyRequest, reply: FastifyReply) {
  const refreshToken = readRefreshCookie(request);
  await revokeRefreshToken(refreshToken);
  clearRefreshCookie(reply);
  return reply.send({ success: true });
}

export async function logoutAllHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.jwtVerify();
  await requireActiveUser(request, reply);
  const jwtUser = request.user as { id: string };
  if (!jwtUser?.id) {
    throw new BadRequestError("Authentication required.");
  }

  await revokeAllUserSessions(jwtUser.id, "LOGOUT_ALL_DEVICES");
  clearRefreshCookie(reply);
  return reply.send({ success: true });
}
