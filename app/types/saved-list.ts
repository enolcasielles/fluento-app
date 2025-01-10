import { Difficulty } from "@/enums/difficulty.enum";

export interface GetSavedListsResponse {
  lists: SavedList[];
}

export interface SavedList {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: Difficulty;
  difficultyLabel: string;
  totalUnits: number;
}