import { loginService } from "../services/login.service";
import { CustomError } from "@/core/errors/custom-error";
import { apiError } from "@/core/api-responses/api-error";
import { LoginRequest } from "../requests/LoginRequest";

export async function LoginController(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as LoginRequest;
    const loginResponse = await loginService(email, password);
    return Response.json(loginResponse);
  } catch (error) {
    if (error instanceof CustomError) {
      return apiError(error);
    }
    return apiError(
      new CustomError({
        message: "Se ha producido un error inesperado al iniciar sesión",
      }),
    );
  }
}
