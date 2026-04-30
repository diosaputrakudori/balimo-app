"use server";

import { CreateBookingSchema } from "@/schema/booking.schema";
import { BookingService } from "@/services/booking.service";
import { revalidatePath } from "next/cache";

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function submitBookingAction(
  prevState: ActionResponse | null, 
  formData: FormData
): Promise<ActionResponse> {
  try {
    // 1. Parsing input FormData ke object
    const rawData = {
      villaId: formData.get("villaId"),
      guestName: formData.get("guestName"),
      guestEmail: formData.get("guestEmail"),
      checkIn: formData.get("checkIn"),
      checkOut: formData.get("checkOut"),
    };

    // 2. Validasi dengan Zod
    const validatedFields = CreateBookingSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Validasi form gagal. Mohon periksa input Anda.",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // 3. Panggil Business Logic Service
    await BookingService.createBooking(validatedFields.data);

    // 4. Revalidate cache halaman
    revalidatePath("/booking");

    return {
      success: true,
      message: "Booking berhasil dibuat!",
    };
  } catch (error: any) {
    // Tangani error dari business logic (misal: Double Booking)
    return {
      success: false,
      message: error.message || "Terjadi kesalahan saat memproses booking.",
    };
  }
}
