export interface GetSavedListsResponse {
  lists: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    difficulty: "ANY" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    totalUnits: number;
  }[];
}
