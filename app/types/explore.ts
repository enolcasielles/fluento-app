import { Difficulty } from "@/enums/difficulty.enum";

export interface ExploreCategory {
  id: string;
  name: string;
  lists: ExploreList[];
}

export interface ExploreList {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: Difficulty;
  totalUnits: number;
}

export interface GetExploreResponse {
  categories: Array<ExploreCategory>;
}

