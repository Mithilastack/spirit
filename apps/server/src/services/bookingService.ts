import { BookingStatus } from "../enum";
import prisma from "../prisma"; // Adjust the import path as needed

export const bookingService = {
  async getAllBookings() {
    return await prisma.booking.findMany({
      include: {
        room: true,
        platformBooking: true,
      },
      orderBy: {
        checkIn: "asc",
      },
    });
  },

  async createBooking(data: any) {
    const booking = await prisma.booking.create({
      data: {
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        roomId: data.roomId,
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
        source: data.source,
        totalAmount: data.totalAmount,
        specialRequests: data.specialRequests,
      },
      include: {
        room: true,
      },
    });

    // Update room status
    await prisma.room.update({
      where: { id: data.roomId },
      data: { status: "OCCUPIED" },
    });

    return booking;
  },

  async updateBookingStatus(id: string, status: BookingStatus) {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        room: true,
      },
    });

    if (status === "CHECKED_OUT") {
      await prisma.room.update({
        where: { id: booking.roomId },
        data: { status: "CLEANING" },
      });
    }

    return booking;
  },
};
