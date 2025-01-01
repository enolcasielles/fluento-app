export interface SubmitResultResponse {
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
