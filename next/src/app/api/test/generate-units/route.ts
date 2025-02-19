import { apiError } from "@/core/api-responses/api-error";
import { apiSuccess } from "@/core/api-responses/api-success";
import { listGenerator } from "@/core/engine/list-generator";
import { Difficulty } from "@/core/enums/difficulty.enum";
import { CustomError } from "@/core/errors";

export async function GET() {
  try {
    if (process.env.NODE_ENV !== "development") {
      throw new CustomError({
        message: "Esta ruta solo está disponible en el entorno de desarrollo",
        type: "ValidationError",
        statusCode: 403,
      });
    }

    const list = await listGenerator({
      difficulty: Difficulty.ADVANCED,
      numberOfUnits: 5,
    });

    return apiSuccess(list);
  } catch (error) {
    if (error instanceof CustomError) {
      return apiError(error);
    }
    return apiError(
      new CustomError({
        message: "Se ha producido un error al generar las unidades",
      }),
    );
  }
}
