import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle, TextStyle } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type Props = {
  score: number;
};

const getScoreConfig = (score: number) => {
  switch (score) {
    case 1:
      return {
        icon: '😕',
        text: 'Necesitas practicar más',
        color: colors.error,
      };
    case 2:
      return {
        icon: '🤔',
        text: 'Puedes mejorar',
        color: colors.warning,
      };
    case 3:
      return {
        icon: '😊',
        text: '¡Muy bien!',
        color: colors.info,
      };
    case 4:
      return {
        icon: '🎉',
        text: '¡Perfecto!',
        color: colors.success,
      };
    default:
      return {
        icon: '😕',
        text: 'Necesitas practicar más',
        color: colors.error,
      };
  }
};

export const ResultState = ({ score }: Props) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const config = getScoreConfig(score);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        damping: 15,
        mass: 1,
        stiffness: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            } as ViewStyle,
          ]}
        >
          <Text style={styles.emoji}>{config.icon}</Text>
          <Text style={[styles.text, { color: config.color }]}>
            {config.text}
          </Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Puntuación</Text>
            <View style={[styles.score, { backgroundColor: config.color }]}>
              <Text style={styles.scoreNumber}>{score}</Text>
              <Text style={styles.scoreMax}>/4</Text>
            </View>
          </View>
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
  contentContainer: {
    alignItems: 'center',
    gap: spacing.lg,
  } as ViewStyle,
  emoji: {
    fontSize: 64,
    marginBottom: spacing.sm,
  } as TextStyle,
  text: {
    ...typography.h2,
    textAlign: 'center',
  } as TextStyle,
  scoreContainer: {
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  } as ViewStyle,
  scoreText: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
  } as TextStyle,
  score: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.medium,
  } as ViewStyle,
  scoreNumber: {
    ...typography.h1,
    color: colors.textInverted,
  } as TextStyle,
  scoreMax: {
    ...typography.bodyLarge,
    color: colors.textInverted,
    marginLeft: spacing.xs,
  } as TextStyle,
}); 