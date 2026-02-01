"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const controller_1 = require("./controller");
const schema_1 = require("./schema");
async function authRoutes(app) {
    const server = app.withTypeProvider();
    server.post('/signup', {
        schema: {
            body: schema_1.signupSchema,
            tags: ['Auth'],
            summary: 'Register a new user',
        },
    }, controller_1.signupHandler);
    server.post('/login', {
        schema: {
            body: schema_1.loginSchema,
            tags: ['Auth'],
            summary: 'Login user',
        },
    }, controller_1.loginHandler);
}
//# sourceMappingURL=routes.js.map