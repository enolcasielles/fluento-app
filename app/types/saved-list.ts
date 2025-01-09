export interface GetSavedListsResponse {
  lists: SavedList[];
}

export interface SavedList {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: string;
  totalUnits: number;
}