export interface GetListDetailResponse {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  topic: string;
  grammarStructures: string[];
  totalUnits: number;
  isSaved: boolean;
  userProgress?: {
    practicedUnits: number;
    passedUnits: number;
    averageScore: number;
  };
}
