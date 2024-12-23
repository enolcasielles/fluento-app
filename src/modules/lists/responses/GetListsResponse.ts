export interface GetListsResponse {
  lists: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    totalUnits: number;
    creationStatus: "IN_PROGRESS" | "COMPLETED" | "FAILED";
    progress: {
      completedUnits: number;
      averageScore: number;
    };
  }[];
}
