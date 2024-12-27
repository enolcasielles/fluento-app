import { CustomError } from "@/core/errors";
import { ValidationError } from "@/core/errors/validation-error";
import { z, ZodError } from "zod";

export interface SubmitResultRequest {
  score: number;
}

export const SubmitResultRequestSchema = z.object({
  score: z
    .number()
    .min(1, "La puntuación debe ser al menos 1")
    .max(4, "La puntuación no puede ser mayor a 4")
    .int("La puntuación debe ser un número entero"),
});

export function validateSubmitResultRequest(data: unknown) {
  try {
    SubmitResultRequestSchema.parse(data) as SubmitResultRequest;
  } catch (error) {
    if (error instanceof ZodError) {
      throw ValidationError.fromZodError(error);
    }
    throw new CustomError({
      message: "Los datos proporcionados no son válidos",
    });
  }
}
