import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle, TextStyle } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type Props = {
  remainingTime: number;
};

export const ListeningState = ({ remainingTime }: Props) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;
  const [currentTime, setCurrentTime] = useState(remainingTime);

  useEffect(() => {
    // Animación de pulso para el indicador de grabación
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animación de entrada
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Animación de la barra de progreso
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: remainingTime,
      useNativeDriver: false,
    }).start();

    // Actualizar el contador de tiempo
    const interval = setInterval(() => {
      setCurrentTime((prev) => Math.max(0, prev - 100));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
            } as ViewStyle,
          ]}
        >
          <View style={styles.recordingContainer}>
            <Animated.View
              style={[
                styles.recordingIndicator,
                {
                  transform: [{ scale: pulseAnim }],
                } as ViewStyle,
              ]}
            />
            <View style={styles.recordingRing} />
          </View>
          <Text style={styles.text}>Es tu turno, traduce la frase</Text>
          
          <View style={styles.timerContainer}>
            <View style={styles.progressBarContainer}>
              <Animated.View 
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  } as ViewStyle,
                ]} 
              />
            </View>
            <Text style={styles.timer}>{Math.ceil(currentTime / 1000)}s</Text>
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
  } as ViewStyle,
  recordingContainer: {
    position: 'relative',
    width: spacing.xl * 2,
    height: spacing.xl * 2,
    marginBottom: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  recordingIndicator: {
    position: 'absolute',
    width: spacing.md,
    height: spacing.md,
    backgroundColor: colors.error,
    borderRadius: spacing.md / 2,
  } as ViewStyle,
  recordingRing: {
    position: 'absolute',
    width: spacing.xl * 1.5,
    height: spacing.xl * 1.5,
    borderWidth: 3,
    borderColor: colors.error,
    borderRadius: (spacing.xl * 1.5) / 2,
    opacity: 0.2,
  } as ViewStyle,
  text: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  } as TextStyle,
  timerContainer: {
    width: '100%',
    alignItems: 'center',
  } as ViewStyle,
  progressBarContainer: {
    width: '100%',
    height: spacing.xs,
    backgroundColor: colors.surfaceHover,
    borderRadius: borderRadius.small,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  } as ViewStyle,
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.small,
  } as ViewStyle,
  timer: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  } as TextStyle,
}); 