import { CreationStatus } from "@/enums/creation-status.enum";
import { Difficulty } from "@/enums/difficulty.enum";

export interface ListDetail {
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