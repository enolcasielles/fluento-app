import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, useWindowDimensions, Image } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { OnboardingSlide } from '@/types/onboarding';
import { Button } from './Button';
import { SvgProps } from 'react-native-svg';

interface OnboardingSliderProps {
  slides: OnboardingSlide[];
  onFinish: () => void;
}

export const OnboardingSlider: React.FC<OnboardingSliderProps> = ({
  slides,
  onFinish,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { width: screenWidth } = useWindowDimensions();

  const handleNext = () => {
    if (currentIndex === slides.length - 1) {
      onFinish();
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const renderImage = (item: OnboardingSlide) => {
    if (item.image.type === 'svg') {
      const SvgComponent = item.image.source as React.FC<SvgProps>;
      return (
        <View style={styles.imageContainer}>
          <SvgComponent />
        </View>
      );
    } else {
      return (
        <Image 
          source={item.image.source as any} 
          style={styles.image}
        />
      );
    }
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={[styles.slide, { width: screenWidth }]}>
      {renderImage(item)}
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === currentIndex && styles.paginationDotActive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / screenWidth
          );
          setCurrentIndex(newIndex);
        }}
      />
      {renderPagination()}
      <View style={styles.footer}>
        <Button
          label={currentIndex === slides.length - 1 ? "Empezar" : "Siguiente"}
          onPress={handleNext}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  slide: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '50%',
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.bodyLarge.fontSize,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
  paginationDotActive: {
    backgroundColor: colors.primary,
    width: 16,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: 0,
  },
}); 