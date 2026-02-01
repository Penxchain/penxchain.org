"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasksWithUserStatus = getTasksWithUserStatus;
exports.completeTask = completeTask;
exports.getUserStats = getUserStats;
const db_1 = require("../../shared/database/db");
async function getTasksWithUserStatus(userId) {
    const tasks = await db_1.db.task.findMany({
        where: { isActive: true },
        include: {
            userTasks: {
                where: { userId },
                select: { status: true, completedAt: true },
            },
        },
    });
    return tasks.map((task) => ({
        ...task,
        status: task.userTasks[0]?.status || 'PENDING',
        completedAt: task.userTasks[0]?.completedAt || null,
        userTasks: undefined,
    }));
}
async function completeTask(userId, taskId) {
    return db_1.db.$transaction(async (tx) => {
        const task = await tx.task.findUnique({
            where: { id: taskId },
        });
        if (!task) {
            throw new Error('Task not found');
        }
        if (!task.isActive) {
            throw new Error('Task is not active');
        }
        const existing = await tx.userTask.findUnique({
            where: {
                userId_taskId: { userId, taskId },
            },
        });
        if (existing) {
            throw new Error('Task already completed');
        }
        await tx.userTask.create({
            data: {
                userId,
                taskId,
                status: 'COMPLETED',
            },
        });
        const updatedUser = await tx.user.update({
            where: { id: userId },
            data: {
                pxpBalance: { increment: task.points },
            },
        });
        return updatedUser;
    });
}
async function getUserStats(userId) {
    const user = await db_1.db.user.findUnique({
        where: { id: userId },
        select: {
            pxpBalance: true,
            role: true,
            referralCode: true,
            _count: {
                select: { tasks: true, referrals: true },
            },
        },
    });
    if (!user)
        throw new Error('User not found');
    const rank = await db_1.db.user.count({
        where: { pxpBalance: { gt: user.pxpBalance } },
    });
    return {
        ...user,
        rank: rank + 1,
    };
}
//# sourceMappingURL=service.js.map