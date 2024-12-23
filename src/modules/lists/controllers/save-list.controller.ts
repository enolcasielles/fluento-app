import { NextApiRequest } from "next";
import { saveListService } from "../services/save-list.service";
import { CustomError } from "@/core/errors";
import { apiError } from "@/core/api-responses/api-error";
import { successResponse } from "@/core/responses/basic.response";
import { NextResponse } from "next/server";

export async function SaveListController(request: NextApiRequest) {
  try {
    const { listId } = request.query;
    await saveListService({ listId: listId.toString() });
    return NextResponse.json(successResponse());
  } catch (error) {
    if (error instanceof CustomError) {
      return apiError(error);
    }
    return apiError(
      new CustomError({
        message:
          "Se ha producido un error inesperado intentando guardar la lista",
      }),
    );
  }
}
