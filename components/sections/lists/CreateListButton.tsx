import React from 'react';
import { Button } from '@/components/base/Button';
import { PremiumFeatureModal } from '@/components/base/PremiumFeatureModal';
import { usePremiumFeature } from '@/hooks/usePremiumFeature';
import { Svg, Path } from 'react-native-svg';
import { colors } from '@/theme/colors';

export const CreateListButton = ({
  onCreateList,
  children
}: {
  onCreateList: () => void;
  children?: React.ReactNode;
}) => {
  const {
    showPremiumModal,
    hidePremiumModal,
    handleFeatureAccess,
    feature,
  } = usePremiumFeature({
    key: 'create_list',
    title: 'Crear Lista Personalizada',
    description: 'Actualiza a Premium para crear listas personalizadas ilimitadas y generar el contenido que más te interese.',
  });

  const handlePress = () => {
    handleFeatureAccess(onCreateList);
  };

  return (
    <>
      {children}
      <PremiumFeatureModal
        isVisible={showPremiumModal}
        onClose={hidePremiumModal}
        feature={feature}
      />
    </>
  );
}; 