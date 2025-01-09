import { createContext, useContext } from 'react';

import { useAuthContext } from './auth.context';

import { User } from '@/types/user';
import { ApiError } from '@/types/api-error';
import { CustomError } from '@/utils/custom-error';
import { GetExploreResponse } from '@/types/explore';
import { ListDetail } from '@/types/list-detail';
import { GetMyListsResponse } from '@/types/my-lists';
import { GetSavedListsResponse } from '@/types/saved-list';
import { 
  CreateListRequest, 
  CreateListResponse, 
  RetryCreateListResponse 
} from '@/types/create-list';
import { 
  GetListSessionResponse, 
  EvaluateAnswerResponse, 
  SubmitResultResponse 
} from '@/types/session';

interface ApiContextType {
  getUserProfile: () => Promise<User>;
  getExplore: () => Promise<GetExploreResponse>;
  getListDetail: (listId: string) => Promise<ListDetail>;
  saveList: (listId: string) => Promise<{ success: boolean }>;
  deleteSavedList: (listId: string) => Promise<{ success: boolean }>;
  retryCreateList: (listId: string) => Promise<RetryCreateListResponse>;
  getMyLists: () => Promise<GetMyListsResponse>;
  getSavedLists: () => Promise<GetSavedListsResponse>;
  createList: (data: CreateListRequest) => Promise<CreateListResponse>;
  getListSession: (listId: string) => Promise<GetListSessionResponse>;
  evaluateAnswer: (sessionId: string, unitId: string, audioFile: FormData) => Promise<EvaluateAnswerResponse>;
  submitResult: (sessionId: string, unitId: string, score: number) => Promise<SubmitResultResponse>;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const ApiContext = createContext<ApiContextType>(null);

export const useApiContext = () => useContext(ApiContext);

type ExecuteRequestOptions = {
  path: string;
  refresh?: boolean;
} & RequestInit;

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const { authToken, saveAuthToken } = useAuthContext();

  const executeRequest = async ({ path, refresh = true, ...options }: ExecuteRequestOptions) => {
    try {
      const url = `${API_URL}${path}`;
      console.log(url);
      console.log(authToken);
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        if (error.statusCode === 401 && refresh) {
          await refreshToken();
          return await executeRequest({
            path,
            refresh: false,
            ...options,
          });
        } else throw CustomError.fromApiError(error);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError({
        message: 'Se ha producido un error al realizar la llamada a la API',
      });
    }
  };

  const refreshToken = async () => {
    const response = await executeRequest({
      path: '/auth/refresh',
      method: 'POST',
      refresh: false,
    });
    await saveAuthToken(response.accessToken);
  };

  const getUserProfile = async (): Promise<User> => {
    return executeRequest({
      path: '/user',
      method: 'GET',
    });
  };

  const getExplore = async (): Promise<GetExploreResponse> => {
    return executeRequest({
      path: '/explore',
      method: 'GET',
      refresh: false,
    });
  };

  const getListDetail = async (listId: string): Promise<ListDetail> => {
    return executeRequest({
      path: `/lists/${listId}`,
      method: 'GET',
    });
  };

  const saveList = async (listId: string): Promise<{ success: boolean }> => {
    return executeRequest({
      path: `/lists/${listId}/save`,
      method: 'POST',
    });
  };

  const deleteSavedList = async (listId: string): Promise<{ success: boolean }> => {
    return executeRequest({
      path: `/lists/${listId}/save`,
      method: 'DELETE',
    });
  };

  const retryCreateList = async (listId: string) => {
    return executeRequest({
      path: `/lists/${listId}/retry`,
      method: 'POST',
    });
  };

  const getMyLists = async () => {
    return executeRequest({
      path: '/lists',
      method: 'GET',
    });
  };

  const getSavedLists = async () => {
    return executeRequest({
      path: '/lists/saved',
      method: 'GET',
    });
  };

  const createList = async (data: {
    name: string;
    topic: string;
    difficulty: 'any' | 'beginner' | 'intermediate' | 'advanced';
    grammarStructures: string;
  }) => {
    return executeRequest({
      path: '/lists',
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  const getListSession = async (listId: string) => {
    return executeRequest({
      path: `/lists/${listId}/session`,
      method: 'GET',
    });
  };

  const evaluateAnswer = async (sessionId: string, unitId: string, audioFile: FormData) => {
    return executeRequest({
      path: `/sessions/${sessionId}/units/${unitId}/evaluate`,
      method: 'POST',
      body: audioFile,
    });
  };

  const submitResult = async (sessionId: string, unitId: string, score: number) => {
    return executeRequest({
      path: `/sessions/${sessionId}/units/${unitId}/result`,
      method: 'POST',
      body: JSON.stringify({ score }),
    });
  };

  const value = {
    getUserProfile,
    getExplore,
    getListDetail,
    saveList,
    deleteSavedList,
    retryCreateList,
    getMyLists,
    getSavedLists,
    createList,
    getListSession,
    evaluateAnswer,
    submitResult,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
