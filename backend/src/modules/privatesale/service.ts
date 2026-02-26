import { db } from '../../shared/database/db';
import { CreateOrderInput } from './schema';

const RATE = 20; // 1 USDT = 20 PENX
const SOFT_CAP = 500000;
const HARD_CAP = 2000000;

export async function createOrder(data: CreateOrderInput) {
  const penxAmount = data.usdtAmount * RATE;

  const order = await db.privateSaleOrder.create({
    data: {
      walletAddress: data.walletAddress,
      usdtAmount: data.usdtAmount,
      penxAmount: penxAmount,
      txHash: data.txHash,
      status: 'PENDING',
    },
  });

  return order;
}

export async function listOrders(status?: string) {
  const where = status ? { status: status as any } : undefined;
  return db.privateSaleOrder.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export async function confirmOrder(orderId: string) {
  return db.privateSaleOrder.update({
    where: { id: orderId },
    data: { status: 'CONFIRMED' },
  });
}

export async function getStats() {
  // Get total raised from CONFIRMED orders
  const confirmedAgg = await db.privateSaleOrder.aggregate({
    _sum: {
      usdtAmount: true,
    },
    where: {
      status: 'CONFIRMED',
    },
  });

  // Also include PENDING orders in progress to show activity (optional, but good for hype)
  // Let's stick to CONFIRMED for accuracy, or maybe both.
  // User asked for "sale progress to be updated aft payment h been confirmed"
  // So we only count CONFIRMED.

  const totalRaised = confirmedAgg._sum.usdtAmount || 0;

  // Count unique participants (wallet addresses)
  const participantsCount = await db.privateSaleOrder.groupBy({
    by: ['walletAddress'],
    where: {
      status: { in: ['CONFIRMED', 'PENDING'] }, // Count pending participants too
    },
  });

  const progressPercentage = Math.min((totalRaised / HARD_CAP) * 100, 100);

  return {
    totalRaised,
    participants: participantsCount.length,
    softCap: SOFT_CAP,
    hardCap: HARD_CAP,
    progressPercentage,
  };
}
