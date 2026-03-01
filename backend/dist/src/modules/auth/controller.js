"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupHandler = signupHandler;
exports.loginHandler = loginHandler;
exports.checkReferralHandler = checkReferralHandler;
exports.refreshSessionHandler = refreshSessionHandler;
exports.logoutHandler = logoutHandler;
exports.logoutAllHandler = logoutAllHandler;
const service_1 = require("./service");
const errors_1 = require("../../shared/errors");
const session_1 = require("./session");
const middleware_1 = require("../../shared/middleware");
function asHeaderString(value) {
    if (Array.isArray(value))
        return value[0];
    return typeof value === "string" ? value : undefined;
}
async function signupHandler(request, reply) {
    const user = await (0, service_1.createUser)(request.body, {
        ip: request.ip,
        userAgent: asHeaderString(request.headers["user-agent"]),
        headers: request.headers,
        deviceId: request.body.deviceId,
    });
    const token = request.server.jwt.sign({
        id: user.id,
        role: user.role,
        tokenVersion: user.tokenVersion,
    });
    const refreshSession = await (0, session_1.issueRefreshToken)(user.id, user.tokenVersion, {
        ip: request.ip,
        userAgent: asHeaderString(request.headers["user-agent"]),
        headers: request.headers,
    });
    (0, session_1.setRefreshCookie)(reply, refreshSession.rawToken);
    const { password, newUserBonusGranted, ...safeUser } = user;
    return reply.status(201).send({
        success: true,
        ...safeUser,
        token,
    });
}
async function loginHandler(request, reply) {
    const user = await (0, service_1.loginUser)(request.body, {
        ip: request.ip,
        userAgent: asHeaderString(request.headers["user-agent"]),
        headers: request.headers,
        deviceId: asHeaderString(request.headers["x-device-id"]),
    });
    const token = request.server.jwt.sign({
        id: user.id,
        role: user.role,
        tokenVersion: user.tokenVersion,
    });
    const refreshSession = await (0, session_1.issueRefreshToken)(user.id, user.tokenVersion, {
        ip: request.ip,
        userAgent: asHeaderString(request.headers["user-agent"]),
        headers: request.headers,
    });
    (0, session_1.setRefreshCookie)(reply, refreshSession.rawToken);
    const { password, ...safeUser } = user;
    return reply.status(200).send({
        success: true,
        ...safeUser,
        token,
    });
}
async function checkReferralHandler(request, reply) {
    const { code } = request.query;
    if (!code)
        throw new errors_1.BadRequestError("Code required");
    const isValid = await (0, service_1.checkReferralCode)(code);
    return reply.send({ success: true, valid: isValid });
}
async function refreshSessionHandler(request, reply) {
    const refreshToken = (0, session_1.readRefreshCookie)(request);
    if (!refreshToken) {
        throw new errors_1.BadRequestError("No refresh session found.");
    }
    const rotated = await (0, session_1.rotateRefreshToken)(refreshToken, {
        ip: request.ip,
        userAgent: asHeaderString(request.headers["user-agent"]),
        headers: request.headers,
    });
    (0, session_1.setRefreshCookie)(reply, rotated.rawRefreshToken);
    const token = request.server.jwt.sign({
        id: rotated.userId,
        role: rotated.role,
        tokenVersion: rotated.tokenVersion,
    });
    return reply.send({ success: true, token });
}
async function logoutHandler(request, reply) {
    const refreshToken = (0, session_1.readRefreshCookie)(request);
    await (0, session_1.revokeRefreshToken)(refreshToken);
    (0, session_1.clearRefreshCookie)(reply);
    return reply.send({ success: true });
}
async function logoutAllHandler(request, reply) {
    await request.jwtVerify();
    await (0, middleware_1.requireActiveUser)(request, reply);
    const jwtUser = request.user;
    if (!jwtUser?.id) {
        throw new errors_1.BadRequestError("Authentication required.");
    }
    await (0, session_1.revokeAllUserSessions)(jwtUser.id, "LOGOUT_ALL_DEVICES");
    (0, session_1.clearRefreshCookie)(reply);
    return reply.send({ success: true });
}
//# sourceMappingURL=controller.js.map