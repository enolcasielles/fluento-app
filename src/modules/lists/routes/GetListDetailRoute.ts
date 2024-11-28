import { NextResponse } from "next/server";

export async function GetListDetailRoute(
  request: Request,
  { params }: { params: { listId: string } },
) {
  // TODO: Implementar obtención de detalle de lista
  return NextResponse.json({ message: "Not implemented" });
}
