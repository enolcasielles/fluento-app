import { CreationStatus } from "@/enums/creation-status.enum";
import { Difficulty } from "@/enums/difficulty.enum";

export interface MyList {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: Difficulty;
  difficultyLabel: string;
  totalUnits: number;
  creationStatus: CreationStatus;
  creationStatusLabel: string;
  progress?: {
    completedUnits: number;
    averageScore: number;
  };
}

export interface GetMyListsResponse {
  lists: MyList[];
} 