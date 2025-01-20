import { CreationStatus } from '@/enums/creation-status.enum';
import { Difficulty } from '@/enums/difficulty.enum';

export interface CreateListRequest {
  name: string;
  topic: string;
  difficulty: Difficulty;
  grammarStructures: string;
}

export interface CreateListResponse {
  id: string;
  name: string;
  topic: string;
  imageUrl: string;
  difficulty: string;
  grammarStructures: string;
  creationStatus: CreationStatus;
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

export interface CreateListFormErrors {
  name?: string;
  topic?: string;
  difficulty?: string;
  grammarStructures?: string;
}