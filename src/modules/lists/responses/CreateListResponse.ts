export interface CreateListResponse {
  id: string;
  name: string;
  topic: string;
  imageUrl: string;
  difficulty: string;
  grammarStructures: string;
  creationStatus: "IN_PROGRESS" | "COMPLETED" | "FAILED";
}
