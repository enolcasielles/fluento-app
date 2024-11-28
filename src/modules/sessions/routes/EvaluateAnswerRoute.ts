import { NextResponse } from "next/server";

export async function EvaluateAnswerRoute(
  request: Request,
  { params }: { params: { sessionId: string; unitId: string } },
) {
  // TODO: Implementar evaluación de respuesta
  return NextResponse.json({ message: "Not implemented" });
}
