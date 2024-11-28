import { NextResponse } from "next/server";

export async function RetryCreateListRoute(
  request: Request,
  { params }: { params: { listId: string } },
) {
  // TODO: Implementar reintento de creación de lista
  return NextResponse.json({ message: "Not implemented" });
}
