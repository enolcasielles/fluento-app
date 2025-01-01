import { GetUserController } from "../controllers/get-user.controller";

export async function GetUserRoute(request: Request) {
  return GetUserController(request);
}
