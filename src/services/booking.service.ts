import { prisma } from "@/lib/prisma";
import { CreateBookingInput } from "@/schema/booking.schema";

export class BookingService {
  /**
   * Mengecek apakah villa tersedia pada rentang tanggal tertentu.
   * Logika: (RequestedCheckIn < ExistingCheckOut) AND (RequestedCheckOut > ExistingCheckIn)
   * Jika ada booking yang overlap dan berstatus selain CANCELLED, maka villa tidak tersedia.
   */
  static async checkAvailability(villaId: string, checkIn: Date, checkOut: Date): Promise<boolean> {
    const overlappingBookings = await prisma.booking.findFirst({
      where: {
        villaId,
        status: {
          not: "CANCELLED",
        },
        AND: [
          { checkIn: { lt: checkOut } },
          { checkOut: { gt: checkIn } }
        ],
      },
    });

    // Jika null, berarti tidak ada booking yang overlap -> tersedia
    return overlappingBookings === null;
  }

  /**
   * Membuat booking baru dengan memvalidasi ketersediaan terlebih dahulu.
   */
  static async createBooking(data: CreateBookingInput) {
    const isAvailable = await this.checkAvailability(
      data.villaId, 
      data.checkIn, 
      data.checkOut
    );

    if (!isAvailable) {
      throw new Error("Villa tidak tersedia pada tanggal tersebut (Double Booking).");
    }

    // Ambil harga per malam dari Villa
    const villa = await prisma.villa.findUnique({
      where: { id: data.villaId },
    });

    if (!villa) {
      throw new Error("Villa tidak ditemukan.");
    }

    // Kalkulasi total harga
    const nights = Math.ceil((data.checkOut.getTime() - data.checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = Number(villa.pricePerNight) * nights;

    // Simpan ke database
    return await prisma.booking.create({
      data: {
        villaId: data.villaId,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        totalPrice: totalPrice,
        status: "CONFIRMED", // Atau PENDING jika butuh payment gateway
      },
    });
  }
}
