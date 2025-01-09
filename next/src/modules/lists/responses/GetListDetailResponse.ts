export interface GetListDetailResponse {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: string;
  topic: string;
  grammarStructures: string;
  totalUnits: number;
  isSaved: boolean;
  creationStatus: string;
  userProgress: {
    practicedUnits: number;
    passedUnits: number;
    averageScore: number;
  };
}
