export interface MyList {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: string;
  totalUnits: number;
  creationStatus: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  progress?: {
    completedUnits: number;
    averageScore: number;
  };
}

export interface GetMyListsResponse {
  lists: MyList[];
} 