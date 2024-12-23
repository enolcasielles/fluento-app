import { GetListSessionResponse } from "@/modules/sessions/responses/GetListSessionResponse";

interface Props {
  listId: string;
}

export async function getListSessionService({
  listId,
}: Props): Promise<GetListSessionResponse> {
  // TODO: Implementar obtención de sesión de lista
  console.log(listId);
  return {
    sessionId: "",
    listId: listId,
    listName: "",
    nextUnit: {
      id: "",
      question: {
        text: "",
        audio: "",
      },
      answer: {
        text: "",
        audio: "",
      },
      responseTime: 0,
    },
  };
}
