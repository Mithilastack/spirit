import { Priority, TaskStatus } from "../enum";
import prisma from "../prisma";

export const maintenanceService = {
  async getAllLogs() {
    return await prisma.maintenanceLog.findMany({
      include: {
        room: true,
      },
      orderBy: [
        {
          priority: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });
  },

  async createMaintenanceLog(data: any) {
    const log = await prisma.maintenanceLog.create({
      data: {
        roomId: data.roomId,
        issue: data.issue,
        priority: data.priority as Priority,
        status: TaskStatus.PENDING,
        assignedTo: data.assignedTo,
      },
      include: {
        room: true,
      },
    });

    // Update room status
    await prisma.room.update({
      where: { id: data.roomId },
      data: { status: "MAINTENANCE" },
    });

    return log;
  },
};
