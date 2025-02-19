import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle, Animated } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';

import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { typography } from '@/theme/typography';

interface Props {
  onSelectScore: (score: number) => void;
}

export const ManualEvaluationState = ({ onSelectScore }: Props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnims = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;
  const translateAnims = useRef([
    new Animated.Value(50),
    new Animated.Value(50),
    new Animated.Value(50),
  ]).current;
  const opacityAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const scoreOptions = [
    { score: 1, text: 'Mal', icon: 'emoji-sad', color: colors.error },
    { score: 2, text: 'Regular', icon: 'emoji-neutral', color: colors.warning },
    { score: 3, text: 'Genial', icon: 'emoji-happy', color: colors.success },
  ];

  useEffect(() => {
    // Animación de entrada del título
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Animación secuencial de las opciones
    scoreOptions.forEach((_, index) => {
      Animated.sequence([
        Animated.delay(index * 100),
        Animated.parallel([
          Animated.timing(translateAnims[index], {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnims[index], {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });
  }, []);

  const handlePressIn = (index: number) => {
    Animated.spring(scaleAnims[index], {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index: number) => {
    Animated.spring(scaleAnims[index], {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        ¿Qué tal lo has hecho?
      </Animated.Text>
      <View style={styles.optionsContainer}>
        {scoreOptions.map((option, index) => (
          <Animated.View
            key={option.score}
            style={[
              styles.optionWrapper,
              {
                opacity: opacityAnims[index],
                transform: [
                  { translateY: translateAnims[index] },
                  { scale: scaleAnims[index] },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.option, { backgroundColor: option.color }]}
              onPress={() => onSelectScore(option.score)}
              onPressIn={() => handlePressIn(index)}
              onPressOut={() => handlePressOut(index)}
              activeOpacity={1}
            >
              <Entypo name={option.icon as any} size={32} color={colors.textInverted} />
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.xl,
    width: '100%',
  } as ViewStyle,
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
  } as TextStyle,
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    width: '100%',
    maxWidth: 600,
    paddingHorizontal: spacing.md,
  } as ViewStyle,
  optionWrapper: {
    flex: 1,
  } as ViewStyle,
  option: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    paddingHorizontal: 0,
    borderRadius: borderRadius.medium,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  } as ViewStyle,
  optionText: {
    ...typography.bodyLarge,
    color: colors.textInverted,
    fontWeight: typography.bold,
    fontSize: 16,
    textAlign: 'center',
  } as TextStyle,
}); 