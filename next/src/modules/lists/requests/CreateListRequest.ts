import { Difficulty } from "@/core/enums/difficulty.enum";
import { CustomError } from "@/core/errors";
import { ValidationError } from "@/core/errors/validation-error";
import { z, ZodError } from "zod";
export interface CreateListRequest {
  name: string;
  topic: string;
  difficulty: Difficulty;
  grammarStructures: string;
}

export const createListRequestSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  topic: z.string().min(1, "El tema es requerido"),
  difficulty: z.nativeEnum(Difficulty),
  grammarStructures: z
    .string()
    .min(1, "Las estructuras gramaticales son requeridas"),
});

export function validateCreateListRequest(data: unknown): CreateListRequest {
  try {
    return createListRequestSchema.parse(data) as CreateListRequest;
  } catch (error) {
    if (error instanceof ZodError) {
      throw ValidationError.fromZodError(error);
    }
    throw new CustomError({
      message: "Los datos proporcionados no son válidos",
    });
  }
}
