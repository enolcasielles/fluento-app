export interface GetExploreResponse {
  categories: {
    id: string;
    name: string;
    lists: {
      id: string;
      name: string;
      description: string;
      imageUrl: string;
      difficulty: "beginner" | "intermediate" | "advanced";
      totalUnits: number;
    }[];
  }[];
}
