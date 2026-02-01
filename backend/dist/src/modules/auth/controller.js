"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupHandler = signupHandler;
exports.checkReferralHandler = checkReferralHandler;
exports.loginHandler = loginHandler;
const service_1 = require("./service");
const errors_1 = require("../../shared/errors");
const recaptcha_1 = require("../../shared/recaptcha");
async function signupHandler(request, reply) {
    try {
        if (request.body.recaptchaToken) {
            const { success, score, error } = await (0, recaptcha_1.verifyRecaptcha)(request.body.recaptchaToken, 'signup');
            if (!success || score < recaptcha_1.RECAPTCHA_MIN_SCORE) {
                throw new errors_1.BadRequestError(error || "Security verification failed. Please try again.");
            }
        }
        const user = await (0, service_1.createUser)(request.body);
        const token = request.server.jwt.sign({ id: user.id, role: user.role });
        const { password, ...safeUser } = user;
        return reply.status(201).send({ success: true, ...safeUser, token });
    }
    catch (error) {
        throw error;
    }
}
async function checkReferralHandler(request, reply) {
    const { code } = request.query;
    if (!code)
        return reply.status(400).send({ success: false, valid: false, message: "Code required" });
    const isValid = await (0, service_1.checkReferralCode)(code);
    return reply.send({ success: true, valid: isValid });
}
async function loginHandler(request, reply) {
    try {
        if (request.body.recaptchaToken) {
            const { success, score, error } = await (0, recaptcha_1.verifyRecaptcha)(request.body.recaptchaToken, 'login');
            if (!success || score < recaptcha_1.RECAPTCHA_MIN_SCORE) {
                throw new errors_1.BadRequestError(error || "Security verification failed. Please try again.");
            }
        }
        const user = await (0, service_1.loginUser)(request.body);
        const token = request.server.jwt.sign({ id: user.id, role: user.role });
        const { password, ...safeUser } = user;
        return reply.status(200).send({ success: true, ...safeUser, token });
    }
    catch (error) {
        throw error;
    }
}
//# sourceMappingURL=controller.js.map