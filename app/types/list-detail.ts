import { CreationStatus } from "@/enums/creation-status.enum";
import { Difficulty } from "@/enums/difficulty.enum";

export interface ListDetail {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: Difficulty;
  difficultyLabel: string;
  topic: string;
  grammarStructures: string;
  totalUnits: number;
  isSaved: boolean;
  creationStatus: CreationStatus;
  creationStatusLabel: string;
  userProgress: {
    practicedUnits: number;
    passedUnits: number;
    averageScore: number;
  };
} 