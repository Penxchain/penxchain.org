"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupHandler = signupHandler;
exports.loginHandler = loginHandler;
const service_1 = require("./service");
async function signupHandler(request, reply) {
    try {
        const user = await (0, service_1.createUser)(request.body);
        const token = request.server.jwt.sign({ id: user.id, role: user.role });
        return reply.status(201).send({ ...user, token });
    }
    catch (error) {
        if (error.message === 'User already exists' || error.message === 'Email already registered' || error.message === 'Username already taken') {
            return reply.status(409).send({ message: error.message });
        }
        throw error;
    }
}
async function loginHandler(request, reply) {
    try {
        const user = await (0, service_1.loginUser)(request.body);
        const token = request.server.jwt.sign({ id: user.id, role: user.role });
        return reply.status(200).send({ ...user, token });
    }
    catch (error) {
        if (error.message === 'Invalid credentials') {
            return reply.status(401).send({ message: error.message });
        }
        throw error;
    }
}
//# sourceMappingURL=controller.js.map