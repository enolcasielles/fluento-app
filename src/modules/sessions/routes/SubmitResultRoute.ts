import { NextResponse } from "next/server";

export async function SubmitResultRoute(
  request: Request,
  { params }: { params: { sessionId: string; unitId: string } },
) {
  // TODO: Implementar registro de resultado y obtención de siguiente unidad
  return NextResponse.json({ message: "Not implemented" });
}
