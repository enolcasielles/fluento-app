import { createContext, useContext, useState } from 'react';

import { CustomError } from '@/utils/custom-error';

interface ErrorAction {
  text: string;
  onPress: () => void;
}

interface ErrorState {
  error: CustomError | null;
  action?: ErrorAction;
}

interface ErrorContextType {
  error: CustomError | null;
  action?: ErrorAction;
  showError: (error: CustomError, action?: ErrorAction) => void;
  hideError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [errorState, setErrorState] = useState<ErrorState>({ error: null });

  const showError = (error: CustomError, action?: ErrorAction) => {
    setErrorState({ error, action });
  };

  const hideError = () => {
    setErrorState({ error: null });
  };

  return (
    <ErrorContext.Provider
      value={{
        error: errorState.error,
        action: errorState.action,
        showError,
        hideError,
      }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError debe ser usado dentro de un ErrorProvider');
  }
  return context;
}
