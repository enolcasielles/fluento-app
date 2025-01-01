import { CreationStatus } from ".prisma/client";
import { Difficulty } from "@/core/enums/difficulty.enum";

export interface GetMyListsResponse {
  lists: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    difficulty: Difficulty;
    totalUnits: number;
    creationStatus: CreationStatus;
  }[];
}
