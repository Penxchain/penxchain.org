import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../app';
import { db } from '../shared/database/db';
import { FastifyInstance } from 'fastify';

describe('Auth & Admin Integration', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
    // Cleanup
    await db.user.deleteMany({ where: { email: { contains: 'test' } } });
  });

  afterAll(async () => {
    await db.user.deleteMany({ where: { email: { contains: 'test' } } });
    await app.close();
  });

  it('should register a new user', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      },
    });

    expect(response.statusCode).toBe(201);
    const body = response.json();
    expect(body.email).toBe('test@example.com');
    expect(body).toHaveProperty('token');
  });

  it('should login the user', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'test@example.com',
        password: 'password123',
      },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body).toHaveProperty('token');
    expect(body).toHaveProperty('id');
  });

  it('should block non-admins from accessing admin stats', async () => {
    // 1. Login as user
    const loginRes = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'test@example.com', password: 'password123' },
    });
    const { token } = loginRes.json();

    // 2. Try admin route
    const adminRes = await app.inject({
      method: 'GET',
      url: '/admin/stats',
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(adminRes.statusCode).toBe(403);
  });
});
