import React from 'react';
import { OnboardingSlider } from '@/components/base/OnboardingSlider';
import { OnboardingSlide } from '@/types/onboarding';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/layouts/ScreenContainer';
import { SafeAreaView } from 'react-native';

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Aprende inglés de forma natural',
    description: 'Practica con frases reales y mejora tu fluidez hablando inglés como un nativo',
    image: {
      source: require('@/assets/images/onboarding/slide-1.png'),
      type: 'image'
    },
  },
  {
    id: '2',
    title: 'Practica cuando quieras',
    description: 'Dedica unos minutos al día para mejorar tu inglés, sin presiones ni horarios',
    image: {
      source: require('@/assets/images/onboarding/slide-2.png'),
      type: 'image'
    },
  },
  {
    id: '3',
    title: 'Mejora constantemente',
    description: 'La app se adapta a tu nivel y te ayuda a reforzar las frases que más te cuestan',
    image: {
      source: require('@/assets/images/onboarding/slide-3.png'),
      type: 'image'
    },
  },
];

export default function OnboardingScreen() {
  const handleFinish = () => {
    router.replace('/register');
  };

  return <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    <OnboardingSlider slides={slides} onFinish={handleFinish} />;
  </SafeAreaView>
} 