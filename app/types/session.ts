export interface Unit {
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
}

export interface GetListSessionResponse {
  sessionId: string;
  listId: string;
  listName: string;
  nextUnit: Unit;
}

export interface EvaluateAnswerResponse {
  score: number;
  answer: string;
}

export interface SubmitResultResponse {
  nextUnit: Unit;
} 