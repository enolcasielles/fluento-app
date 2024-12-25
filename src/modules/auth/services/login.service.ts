import { CustomError } from "@/core/errors/custom-error";
import { supabase } from "@/core/lib/supabase";
import { LoginResponse } from "../responses/LoginResponse";

enum LoginError {
  EMAIL_NOT_CONFIRMED = "email_not_confirmed",
  INVALID_CREDENTIALS = "invalid_credentials",
}

export const loginService = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    if (error.code === LoginError.EMAIL_NOT_CONFIRMED) {
      throw new CustomError({
        message: "El correo electrónico no ha sido confirmado",
        statusCode: 400,
      });
    }
    if (error.code === LoginError.INVALID_CREDENTIALS) {
      throw new CustomError({
        message: "Credenciales inválidas",
        statusCode: 400,
      });
    }
    throw new CustomError({
      message: "Error al iniciar sesión",
      statusCode: 401,
    });
  }
  return {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  };
};
