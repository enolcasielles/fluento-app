import { useError } from "@/contexts/error.context";
import { CustomError } from "@/utils/custom-error";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

interface UseFetchOptions {
  action: () => Promise<any>;
}

interface UseFetchReturn {
  isLoading: boolean;
  refetch: () => void;
}

export const useFetch = ({ action }: UseFetchOptions): UseFetchReturn => {
  const { showError } = useError();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const _run = async () => {
    try {
      if (isInitialLoading) {
        setIsInitialLoading(false);
        setIsLoading(true);
      }
      await action();
    } catch (error) {
      showError(error as CustomError);
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    _run();
  }, [isInitialLoading]))

  return {
    isLoading,
    refetch: _run,
  }
}