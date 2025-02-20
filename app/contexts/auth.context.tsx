import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

import { User } from '@/types/user';
import { CustomError } from '@/utils/custom-error';

interface AuthContextProps {
  user: User;
  authToken: string;
  saveAuthToken: (token: string) => void;
  setUser: (user: User) => void;
  isLoading: boolean;
}

const AUTH_TOKEN_KEY = '@auth_token';

export const AuthContext = createContext<AuthContextProps>(null);

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveAuthToken = async (newToken: string | null) => {
    try {
      if (newToken) {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, newToken);
      } else {
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      }
      setAuthToken(newToken);
    } catch (error) {
      throw new CustomError({
        message: 'Error al guardar la información del usuario',
      });
    }
  };

  const initAuthToken = async () => {
    const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (storedToken) {
      setAuthToken(storedToken);
    }
  };

  useEffect(() => {
    initAuthToken();
  }, []);

  const value = {
    user,
    setUser,
    authToken,
    saveAuthToken,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
