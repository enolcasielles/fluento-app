import { CreationStatus } from "@/core/enums/creation-status.enum";
import { Difficulty } from "@/core/enums/difficulty.enum";

export interface CreateListResponse {
  id: string;
  name: string;
  topic: string;
  grammarStructures: string;
  difficulty: Difficulty;
  creationStatus: CreationStatus;
}
