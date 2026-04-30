import { z } from "zod";

export const CreateBookingSchema = z.object({
  villaId: z.string().uuid("ID Villa tidak valid"),
  guestName: z.string().min(3, "Nama minimal 3 karakter"),
  guestEmail: z.string().email("Format email tidak valid"),
  checkIn: z.coerce.date().refine((date) => date >= new Date(), {
    message: "Tanggal check-in tidak boleh di masa lalu",
  }),
  checkOut: z.coerce.date(),
}).refine((data) => data.checkOut > data.checkIn, {
  message: "Tanggal check-out harus setelah check-in",
  path: ["checkOut"],
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
