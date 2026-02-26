import { FastifyInstance } from 'fastify';
import { createOrderHandler, getStatsHandler, listOrdersHandler, confirmOrderHandler } from './controller';
import { createOrderSchema, createOrderResponseSchema, getStatsResponseSchema, confirmOrderSchema } from './schema';

export async function privateSaleRoutes(app: FastifyInstance) {
  app.post(
    '/order',
    {
      schema: {
        body: createOrderSchema,
        response: {
          201: createOrderResponseSchema,
        },
      },
    },
    createOrderHandler
  );

  app.get(
    '/stats',
    {
      schema: {
        response: {
          200: getStatsResponseSchema,
        },
      },
    },
    getStatsHandler
  );

  // Admin routes
  app.get('/admin/orders', listOrdersHandler);
  
  app.post(
    '/admin/confirm',
    {
      schema: {
        body: confirmOrderSchema,
      },
    },
    confirmOrderHandler
  );
}
