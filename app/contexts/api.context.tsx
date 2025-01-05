import { createContext, useContext } from 'react';

import { useAuthContext } from './auth.context';

import { User } from '@/types/user';
import { ApiError } from '@/types/api-error';
import { CustomError } from '@/utils/custom-error';

interface ApiContextType {
  // User endpoints
  getUserProfile: () => Promise<User>;
  // Aquí iremos añadiendo más métodos según necesitemos
}

const API_URL = 'http://localhost:3000';

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
      const response = await fetch(`${API_URL}${path}`, {
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
      path: '/api/auth/refresh',
      method: 'POST',
      refresh: false,
    });
    await saveAuthToken(response.accessToken);
  };

  const getUserProfile = async (): Promise<User> => {
    return executeRequest({
      path: '/api/user',
      method: 'GET',
    });
  };

  const value = {
    getUserProfile,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
