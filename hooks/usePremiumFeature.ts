import { useState } from 'react';
import { useSubscription } from '@/contexts/subscription.context';

interface PremiumFeature {
  title: string;
  description: string;
  key: string;
}

export const usePremiumFeature = (feature: PremiumFeature) => {
  const [showModal, setShowModal] = useState(false);
  const { isSubscribed } = useSubscription();

  const handleFeatureAccess = (callback: () => void) => {
    if (isSubscribed) {
      callback();
    } else {
      setShowModal(true);
    }
  };

  return {
    showPremiumModal: showModal,
    hidePremiumModal: () => setShowModal(false),
    handleFeatureAccess,
    isSubscribed,
    feature,
  };
}; 