export interface GetSavedListsResponse {
  lists: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    totalUnits: number;
  }[];
}
