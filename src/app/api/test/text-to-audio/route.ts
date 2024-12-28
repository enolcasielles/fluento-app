import { apiError } from "@/core/api-responses/api-error";
import { apiSuccess } from "@/core/api-responses/api-success";
import { textToAudio } from "@/core/engine/text-to-audio";
import { CustomError } from "@/core/errors";
import { uploadAudio } from "@/core/lib/storage";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV !== "development") {
      throw new CustomError({
        message: "Esta ruta solo está disponible en el entorno de desarrollo",
        type: "ValidationError",
        statusCode: 403,
      });
    }

    const { text, voice, model } = await request.json();

    if (!text) {
      throw new CustomError({
        message: "El texto es requerido",
        type: "ValidationError",
        statusCode: 400,
      });
    }

    const audioBuffer = await textToAudio({
      text,
      voice,
      model,
    });

    // Generar un nombre único para el archivo
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.mp3`;

    // Subir el audio a Supabase y obtener la URL
    const audioUrl = await uploadAudio({
      buffer: audioBuffer,
      path: `generated/${filename}`,
    });

    return apiSuccess({
      url: audioUrl,
      filename,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return apiError(error);
    }
    return apiError(
      new CustomError({
        message: "Se ha producido un error al generar el audio",
      }),
    );
  }
}
