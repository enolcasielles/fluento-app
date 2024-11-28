import { NextResponse } from "next/server";

export async function GetListSessionRoute(
  request: Request,
  { params }: { params: { listId: string } },
) {
  // TODO: Implementar obtención/creación de sesión
  return NextResponse.json({ message: "Not implemented" });
}
