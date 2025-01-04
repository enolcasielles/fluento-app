import { CustomError } from "@/core/errors/custom-error";
import { apiError } from "@/core/api-responses/api-error";
import { RegisterRequest } from "../requests/RegisterRequest";
import { registerService } from "../services/register.service";
import { apiSuccess } from "@/core/api-responses/api-success";

export async function RegisterController(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body as RegisterRequest;
    const registerResponse = await registerService(email, name, password);
    return apiSuccess(registerResponse);
  } catch (error) {
    console.log(error);
    if (error instanceof CustomError) {
      return apiError(error);
    }
    return apiError(
      new CustomError({
        message: "Se ha producido un error inesperado al crear el usuario",
      }),
    );
  }
}
