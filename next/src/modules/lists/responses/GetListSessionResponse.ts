export type EvaluationMode = "auto" | "manual";

export interface GetListSessionResponse {
  sessionId: string;
  listId: string;
  listName: string;
  evaluationMode: EvaluationMode;
  nextUnit: {
    id: string;
    question: {
      text: string;
      audio: string;
    };
    answer: {
      text: string;
      audio: string;
    };
    responseTime: number;
  };
}
