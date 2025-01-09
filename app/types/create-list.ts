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
  difficulty: string;
  grammarStructures: string;
  creationStatus: ListCreationStatus;
}

export interface RetryCreateListResponse {
  id: string;
  name: string;
  topic: string;
  imageUrl: string;
  difficulty: string;
  grammarStructures: string[];
  creationStatus: 'IN_PROGRESS';
} 