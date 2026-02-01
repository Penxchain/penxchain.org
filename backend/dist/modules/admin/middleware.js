"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = requireAdmin;
async function requireAdmin(request, reply) {
    try {
        await request.jwtVerify();
        const user = request.user;
        if (user.role !== 'ADMIN') {
            return reply.status(403).send({ message: 'Forbidden: Admin access required' });
        }
    }
    catch (err) {
        return reply.status(401).send({ message: 'Unauthorized' });
    }
}
//# sourceMappingURL=middleware.js.map