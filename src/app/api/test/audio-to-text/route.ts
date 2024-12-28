import { apiError } from "@/core/api-responses/api-error";
import { apiSuccess } from "@/core/api-responses/api-success";
import { audioToText } from "@/core/engine/audio-to-text";
import { CustomError } from "@/core/errors";
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

    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      throw new CustomError({
        message: "No se ha proporcionado ningún archivo de audio",
        type: "ValidationError",
        statusCode: 400,
      });
    }

    // Verificar el tipo de archivo
    const validTypes = ["audio/mp3", "audio/wav", "audio/mpeg", "audio/webm"];
    if (!validTypes.includes(audioFile.type)) {
      throw new CustomError({
        message:
          "Formato de audio no válido. Por favor, usa MP3, WAV, MPEG o WEBM",
        type: "ValidationError",
        statusCode: 400,
      });
    }

    const transcription = await audioToText(audioFile);

    return apiSuccess({
      text: transcription,
      originalFileName: audioFile.name,
      fileType: audioFile.type,
      fileSize: audioFile.size,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return apiError(error);
    }
    return apiError(
      new CustomError({
        message: "Se ha producido un error al procesar el audio",
      }),
    );
  }
}
