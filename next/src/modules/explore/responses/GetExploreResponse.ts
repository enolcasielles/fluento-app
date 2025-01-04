import { Difficulty } from "@/core/enums/difficulty.enum";

export interface GetExploreResponse {
  categories: {
    id: string;
    name: string;
    lists: {
      id: string;
      name: string;
      description: string;
      imageUrl: string;
      difficulty: Difficulty;
      totalUnits: number;
    }[];
  }[];
}
