import { CreateListRequest } from "../requests/CreateListRequest";
import { CreateListResponse } from "../responses/CreateListResponse";

export async function createListService(
  request: CreateListRequest,
): Promise<CreateListResponse> {
  // TODO: Implementar creación de lista
  console.log(request);
  return {
    id: "new-list-id",
    name: request.name,
    topic: request.topic,
    imageUrl: "",
    difficulty: request.difficulty,
    grammarStructures: request.grammarStructures,
    creationStatus: "IN_PROGRESS",
  };
}
