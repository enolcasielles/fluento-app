import { CreationStatus } from "@/enums/creation-status.enum";
import { Difficulty } from "@/enums/difficulty.enum";

export type ListDifficulty = 'any' | 'beginner' | 'intermediate' | 'advanced';
export type ListCreationStatus = 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export interface CreateListRequest {
  name: string;
  topic: string;
  difficulty: ListDifficulty;
  grammarStructures: string;
}

export interface CreateListResponse {
  id: string;
  name: string;
  topic: string;
  imageUrl: string;
  difficulty: Difficulty;
  difficultyLabel: string;
  grammarStructures: string;
  creationStatus: CreationStatus;
  creationStatusLabel: string;
}

export interface RetryCreateListResponse {
  id: string;
  name: string;
  topic: string;
  imageUrl: string;
  difficulty: Difficulty;
  difficultyLabel: string;
  grammarStructures: string[];
  creationStatus: CreationStatus;
  creationStatusLabel: string;
} 