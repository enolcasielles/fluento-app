import { CreationStatus } from "@/core/enums/creation-status.enum";
import { Difficulty } from "@/core/enums/difficulty.enum";

export interface GetMyListsResponse {
  lists: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    difficulty: Difficulty;
    difficultyLabel: string;
    totalUnits: number;
    creationStatus: CreationStatus;
    creationStatusLabel: string;
  }[];
}
