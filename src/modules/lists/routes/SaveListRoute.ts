import { NextResponse } from "next/server";

export async function SaveListRoute(
  request: Request,
  { params }: { params: { listId: string } },
) {
  // TODO: Implementar guardar lista
  return NextResponse.json({ message: "Not implemented" });
}
