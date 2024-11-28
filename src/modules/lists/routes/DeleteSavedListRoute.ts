import { NextResponse } from "next/server";

export async function DeleteSavedListRoute(
  request: Request,
  { params }: { params: { listId: string } },
) {
  // TODO: Implementar eliminar lista guardada
  return NextResponse.json({ message: "Not implemented" });
}
