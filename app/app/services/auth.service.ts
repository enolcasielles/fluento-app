import { supabase } from "@/lib/supabase";
import { CustomError } from "@/utils/custom-error";

enum LoginError {
  EMAIL_NOT_CONFIRMED = "email_not_confirmed",
  INVALID_CREDENTIALS = "invalid_credentials",
}

export const loginService = async (email: string, password: string): Promise<{ accessToken: string }> => {
  try {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (error.code === LoginError.EMAIL_NOT_CONFIRMED) {
        throw new CustomError({
          message: "El correo electrónico no ha sido confirmado",
        });
      }
      if (error.code === LoginError.INVALID_CREDENTIALS) {
        throw new CustomError({
          message: "Credenciales inválidas",
        });
      }
      throw new CustomError({
        message: "Error al iniciar sesión",
      });
    }
    if (!data.session?.access_token) {
      throw new CustomError({
        message: "Error al iniciar sesión",
      });
    }
    return { accessToken: data.session?.access_token };
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    } else {
      throw new CustomError({
        message: 'Error inesperado durante el login',
      });
    }
  }
};