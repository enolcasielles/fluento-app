import { GetListDetailResponse } from "../responses/GetListDetailResponse";

interface Props {
  listId: string;
}

export async function getListDetailService({
  listId,
}: Props): Promise<GetListDetailResponse> {
  // TODO: Implementar obtención de detalles de lista
  console.log(listId);
  return {
    id: listId,
    name: "",
    description: "",
    imageUrl: "",
    difficulty: "beginner",
    topic: "",
    grammarStructures: [],
    totalUnits: 0,
    isSaved: false,
  };
}
