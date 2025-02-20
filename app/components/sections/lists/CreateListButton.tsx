import React from 'react';
import { Button } from '@/components/base/Button';
import { PremiumFeatureModal } from '@/components/base/PremiumFeatureModal';
import { usePremiumFeature } from '@/hooks/usePremiumFeature';
import { Svg, Path } from 'react-native-svg';
import { colors } from '@/theme/colors';


const PlusIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
      fill={colors.primary}
    />
  </Svg>
);

export const CreateListButton = ({
  onCreateList
}: {
  onCreateList: () => void;
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
      <Button
        variant="icon"
        icon={<PlusIcon />}
        label=""
        onPress={handlePress}
      />
      <PremiumFeatureModal
        isVisible={showPremiumModal}
        onClose={hidePremiumModal}
        feature={feature}
      />
    </>
  );
}; 