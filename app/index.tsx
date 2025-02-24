import { View } from 'react-native';
import { Button } from '../components/base/Button';
import { useRouter } from 'expo-router';
import { colors, spacing } from '../theme';
import * as speechService from '../services/speech.service';

export default function Home() {
  const router = useRouter();

  const playText = async (text: string, language: string) => {
    try {
      await speechService.speak(text, { language });
    } catch (error) {
      console.error('Error playing text:', error);
    }
  };

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: colors.background,
      gap: spacing.md,
    }}>
      <Button
        label="Ver Design System"
        onPress={() => router.push('/design-system')}
      />
      <Button
        label="Iniciar Sesión"
        onPress={() => router.push('/login')}
      />
      <Button
        label="Go Practice"
        onPress={() => router.push('/practice/61d0117e-03fa-471b-bb2f-ef71bac474f0')}
      />
      <Button
        label="Test Page"
        onPress={() => router.push('/test')}
      />
      <Button
        label="Onboarding"
        onPress={() => router.push('/onboarding')}
      />
    </View>
  );
}
