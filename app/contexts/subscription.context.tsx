import React, { createContext, useContext, useEffect, useState } from 'react';
import {  SubscriptionStatus } from '@/types/subscription';
import { CustomError } from '@/utils/custom-error';
import { useApiContext } from './api.context';
import { useAuthContext } from './auth.context';

interface SubscriptionContextType {
  isSubscribed: boolean;
  subscriptionStatus: SubscriptionStatus | null;
  isLoading: boolean;
  subscribe: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
  refreshStatus: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>(null);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription debe ser usado dentro de un SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  
  const api = useApiContext();

  const refreshStatus = async () => {
    try {
      setIsLoading(true);
      const status = await api.getSubscriptionStatus();
      setSubscriptionStatus(status);
    } catch (error) {
      console.error('Error refreshing subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('User changed:', user);
    if (user) {
      refreshStatus();
    }
  }, [user]);

  const subscribe = async () => {
    try {
      setIsLoading(true);
      await api.activateSubscription();
      await refreshStatus();
    } catch (error) {
      throw new CustomError({
        message: 'Error al procesar la suscripción',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      setIsLoading(true);
      await api.cancelSubscription();
      await refreshStatus();
    } catch (error) {
      throw new CustomError({
        message: 'Error al cancelar la suscripción',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isSubscribed: subscriptionStatus?.isActive || false,
    subscriptionStatus,
    isLoading,
    subscribe,
    cancelSubscription,
    refreshStatus,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}; 