export interface GetListDetailResponse {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: "ANY" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  topic: string;
  grammarStructures: string;
  totalUnits: number;
  isSaved: boolean;
  creationStatus: "IN_PROGRESS" | "COMPLETED" | "FAILED";
  userProgress: {
    practicedUnits: number;
    passedUnits: number;
    averageScore: number;
  };
}
