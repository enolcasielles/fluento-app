import { Difficulty } from "@/core/enums/difficulty.enum";

export interface GetSavedListsResponse {
  lists: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    difficulty: Difficulty;
    difficultyLabel: string;
    totalUnits: number;
  }[];
}
