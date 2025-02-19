import { NextResponse } from "next/server";
import { getRandomImage } from "@/core/lib/unsplash";

export async function GET() {
  try {
    // Probamos con un caso de ejemplo
    const imageUrl = await getRandomImage(["Learning English Illustration"]);

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
