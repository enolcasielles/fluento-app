import { generateUnits } from "@/core/engine/units-generator";
import { Difficulty } from "@/core/enums/difficulty.enum";

export async function GET() {
  try {
    const units = await generateUnits({
      difficulty: Difficulty.ADVANCED,
      numberOfUnits: 5,
    });

    return Response.json({ units });
  } catch (error) {
    return Response.json(
      { error: "Error al generar las unidades" },
      { status: 500 },
    );
  }
}
