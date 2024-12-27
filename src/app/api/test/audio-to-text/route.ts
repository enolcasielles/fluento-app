import { audioToText } from "@/core/engine/audio-to-text";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return Response.json(
        { error: "No se ha proporcionado ningún archivo de audio" },
        { status: 400 },
      );
    }

    // Verificar el tipo de archivo
    const validTypes = ["audio/mp3", "audio/wav", "audio/mpeg", "audio/webm"];
    if (!validTypes.includes(audioFile.type)) {
      return Response.json(
        {
          error:
            "Formato de audio no válido. Por favor, usa MP3, WAV, MPEG o WEBM",
        },
        { status: 400 },
      );
    }

    const transcription = await audioToText(audioFile);

    return Response.json({
      text: transcription,
      originalFileName: audioFile.name,
      fileType: audioFile.type,
      fileSize: audioFile.size,
    });
  } catch (error) {
    return Response.json(
      { error: "Error al procesar el audio" },
      { status: 500 },
    );
  }
}
