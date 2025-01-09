import { createContext, useContext } from 'react';

import { useAuthContext } from './auth.context';

import { User } from '@/types/user';
import { ApiError } from '@/types/api-error';
import { CustomError } from '@/utils/custom-error';
import { GetExploreResponse } from '@/types/explore';
import { ListDetail } from '@/types/list-detail';

interface ApiContextType {
  getUserProfile: () => Promise<User>;
  getExplore: () => Promise<GetExploreResponse>;
  getListDetail: (listId: string) => Promise<ListDetail>;
  saveList: (listId: string) => Promise<{ success: boolean }>;
  deleteSavedList: (listId: string) => Promise<{ success: boolean }>;
  retryCreateList: (listId: string) => Promise<{
    id: string;
    name: string;
    topic: string;
    imageUrl: string;
    difficulty: string;
    grammarStructures: string[];
    creationStatus: 'IN_PROGRESS';
  }>;
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

  const value = {
    getUserProfile,
    getExplore,
    getListDetail,
    saveList,
    deleteSavedList,
    retryCreateList,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
