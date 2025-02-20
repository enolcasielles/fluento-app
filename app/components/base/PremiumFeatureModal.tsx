import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { Button } from './Button';
import { useRouter } from 'expo-router';

interface PremiumFeatureModalProps {
  isVisible: boolean;
  onClose: () => void;
  feature: {
    title: string;
    description: string;
  };
}

export const PremiumFeatureModal: React.FC<PremiumFeatureModalProps> = ({
  isVisible,
  onClose,
  feature,
}) => {
  const router = useRouter();

  const handleUpgrade = () => {
    onClose();
    router.push('/subscription');
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>{feature.title}</Text>
            <Text style={styles.description}>{feature.description}</Text>
            
            <View style={styles.actions}>
              <Button
                label="Actualizar a Premium"
                onPress={handleUpgrade}
              />
              <Button
                label="Cancelar"
                variant="outline"
                onPress={onClose}
              />
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: colors.background,
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
}); 