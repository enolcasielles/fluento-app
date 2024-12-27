import { textToAudio } from "@/core/engine/text-to-audio";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text, voice, model } = await request.json();

    if (!text) {
      return Response.json({ error: "El texto es requerido" }, { status: 400 });
    }

    const audioBuffer = await textToAudio({
      text,
      voice,
      model,
    });

    // Devolver el audio como una respuesta con el tipo MIME correcto
    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
      },
    });
  } catch (error) {
    return Response.json(
      { error: "Error al generar el audio" },
      { status: 500 },
    );
  }
}
