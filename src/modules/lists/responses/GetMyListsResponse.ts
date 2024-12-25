export interface GetMyListsResponse {
  lists: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    difficulty: "ANY" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    totalUnits: number;
    creationStatus: "IN_PROGRESS" | "COMPLETED" | "FAILED";
  }[];
}
