import { CustomError } from "@/core/errors";
import { apiError } from "@/core/api-responses/api-error";
import { deleteSavedListService } from "../services/delete-saved-list.service";
import { Role } from "@/core/enums/role.enum";
import { authenticate } from "@/core/lib/auth";
import { NextResponse } from "next/server";
import { successResponse } from "@/core/responses/basic.response";

export async function DeleteSavedListController(
  request: Request,
  { params }: { params: { listId: string } },
) {
  try {
    const userId = await authenticate(request, Role.USER);
    await deleteSavedListService(params.listId, userId);
    return NextResponse.json(successResponse());
  } catch (error) {
    if (error instanceof CustomError) {
      return apiError(error);
    }
    return apiError(
      new CustomError({
        message:
          "Se ha producido un error inesperado al eliminar la lista guardada",
      }),
    );
  }
}
