import { NextResponse } from "next/server";
import { generateListImage } from "@/core/engine/generate-list-image";

export async function GET() {
  try {
    // Probamos con un caso de ejemplo
    const imageUrl = await generateListImage({
      topic: "Motocross",
    });

    return NextResponse.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error("Error en test de generación de imagen:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }
}
