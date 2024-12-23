export interface CreateListRequest {
  name: string;
  topic: string;
  difficulty: "any" | "beginner" | "intermediate" | "advanced";
  grammarStructures: string;
}
