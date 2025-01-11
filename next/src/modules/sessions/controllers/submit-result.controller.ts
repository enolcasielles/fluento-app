import { CustomError } from "@/core/errors";
import { apiError } from "@/core/api-responses/api-error";
import { submitResultService } from "../services/submit-result.service";
import { Role } from "@/core/enums/role.enum";
import { authenticate } from "@/core/lib/auth";
import {
  SubmitResultRequest,
  validateSubmitResultRequest,
} from "../requests/SubmitResultRequest";
import { apiSuccess } from "@/core/api-responses/api-success";

export async function SubmitResultController(
  request: Request,
  { params }: { params: { sessionId: string; unitId: string } },
) {
  try {
    const userId = await authenticate(request, Role.USER);
    const body = await request.json();

    validateSubmitResultRequest(body);

    const response = await submitResultService(
      params.sessionId,
      params.unitId,
      userId,
      body as SubmitResultRequest,
    );

    return apiSuccess(response);
  } catch (error) {
    if (error instanceof CustomError) {
      return apiError(error);
    }
    console.error(error);
    return apiError(
      new CustomError({
        message:
          "Se ha producido un error inesperado al registrar el resultado",
      }),
    );
  }
}
