import { CustomError } from "@/core/errors";
import { apiError } from "@/core/api-responses/api-error";
import { Role } from "@/core/enums/role.enum";
import { authenticate } from "@/core/lib/auth";
import { evaluateAnswerService } from "../services/evaluate-answer.service";
import { apiSuccess } from "@/core/api-responses/api-success";

export async function EvaluateAnswerController(
  request: Request,
  { params }: { params: { sessionId: string; unitId: string } },
) {
  try {
    const userId = await authenticate(request, Role.USER);

    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      throw new CustomError({
        message: "No se ha proporcionado ningún archivo de audio",
        type: "ValidationError",
        statusCode: 400,
      });
    }

    const response = await evaluateAnswerService(
      params.sessionId,
      params.unitId,
      userId,
      audioFile,
    );

    return apiSuccess(response);
  } catch (error) {
    if (error instanceof CustomError) {
      return apiError(error);
    }
    return apiError(
      new CustomError({
        message:
          "Se ha producido un error inesperado al registrar el resultado",
      }),
    );
  }
}
