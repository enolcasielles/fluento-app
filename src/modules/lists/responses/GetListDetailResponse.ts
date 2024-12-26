import { CreationStatus } from "@/core/enums/creation-status.enum";
import { Difficulty } from "@/core/enums/difficulty.enum";

export interface GetListDetailResponse {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: Difficulty;
  topic: string;
  grammarStructures: string;
  totalUnits: number;
  isSaved: boolean;
  creationStatus: CreationStatus;
  userProgress: {
    practicedUnits: number;
    passedUnits: number;
    averageScore: number;
  };
}
