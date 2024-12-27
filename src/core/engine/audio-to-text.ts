import { OpenAI } from "openai";
import { CustomError } from "../errors";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function audioToText(audio: File): Promise<string> {
  try {
    // Convertir el File a un Buffer
    const arrayBuffer = await audio.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const transcription = await openai.audio.transcriptions.create({
      file: new File([buffer], audio.name, { type: audio.type }),
      model: "whisper-1",
      language: "en",
      response_format: "text",
    });

    if (!transcription) {
      throw new CustomError({
        message: "No se pudo transcribir el audio",
      });
    }

    return transcription;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError({
      message: "Error al procesar el audio",
    });
  }
}
