export interface GetSavedListsResponse {
  lists: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    difficulty: string;
    totalUnits: number;
  }[];
}
