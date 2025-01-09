import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

import { useError } from '@/contexts/error.context';
import { colors, spacing, typography, borderRadius, dimensions } from '../../theme';

export function ErrorModal() {
  const { error, action, hideError } = useError();

  if (!error) return null;

  return (
    <Modal 
      animationType="fade" 
      transparent 
      visible={!!error} 
      onRequestClose={hideError}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Error</Text>
          <Text style={styles.message}>{error.message}</Text>
          
          <View style={styles.actions}>
            {action && (
              <TouchableOpacity
                onPress={() => {
                  action.onPress();
                  hideError();
                }}
                style={[styles.button, styles.primaryButton]}
              >
                <Text style={styles.primaryButtonText}>{action.text}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              onPress={hideError} 
              style={[styles.button, styles.secondaryButton]}
            >
              <Text style={styles.secondaryButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  container: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.large,
    padding: spacing.lg,
    width: '100%',
    maxWidth: dimensions.maxContentWidth,
    gap: spacing.md,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.semibold,
    color: colors.error,
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.medium,
    minWidth: 80,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.error,
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: typography.body.fontSize,
    fontWeight: typography.medium,
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: colors.background,
    fontSize: typography.body.fontSize,
    fontWeight: typography.medium,
    textAlign: 'center',
  },
});
