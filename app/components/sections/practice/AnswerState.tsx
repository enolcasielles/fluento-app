import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type Props = {
  text: string;
  isEvaluating: boolean;
};

export const AnswerState = ({ text, isEvaluating }: Props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.languageIndicator}>
          <Text style={styles.languageText}>EN</Text>
        </View>
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            } as ViewStyle,
          ]}
        >
          <Text style={styles.text}>{text}</Text>
          {isEvaluating && (
            <View style={styles.evaluatingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.evaluatingText}>Evaluando respuesta...</Text>
            </View>
          )}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  } as ViewStyle,
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.large,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,
  languageIndicator: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  } as ViewStyle,
  languageText: {
    ...typography.bodySmall,
    color: colors.textInverted,
    fontWeight: typography.semibold,
  } as TextStyle,
  contentContainer: {
    alignItems: 'center',
    gap: spacing.lg,
  } as ViewStyle,
  text: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
  } as TextStyle,
  evaluatingContainer: {
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  } as ViewStyle,
  evaluatingText: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
  } as TextStyle,
}); 