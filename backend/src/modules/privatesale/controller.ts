import { FastifyReply, FastifyRequest } from 'fastify';
import { createOrder, getStats, listOrders, confirmOrder } from './service';
import { CreateOrderInput } from './schema';

export async function createOrderHandler(
  request: FastifyRequest<{ Body: CreateOrderInput }>,
  reply: FastifyReply
) {
  try {
    const order = await createOrder(request.body);
    return reply.status(201).send({
      success: true,
      orderId: order.id,
      message: 'Order created successfully. Please wait for admin confirmation.',
    });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({
      success: false,
      message: 'Failed to create order',
    });
  }
}

export async function listOrdersHandler(
  request: FastifyRequest<{ Querystring: { status?: string } }>,
  reply: FastifyReply
) {
  try {
    const orders = await listOrders(request.query.status);
    return reply.send(orders);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({
      success: false,
      message: 'Failed to list orders',
    });
  }
}

export async function confirmOrderHandler(
  request: FastifyRequest<{ Body: { orderId: string } }>,
  reply: FastifyReply
) {
  try {
    const order = await confirmOrder(request.body.orderId);
    return reply.send({
      success: true,
      message: 'Order confirmed',
      order,
    });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({
      success: false,
      message: 'Failed to confirm order',
    });
  }
}

export async function getStatsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const stats = await getStats();
    return reply.send(stats);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({
      success: false,
      message: 'Failed to fetch stats',
    });
  }
}
