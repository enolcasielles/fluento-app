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
        variant="secondary"
        onPress={() => router.push('/login')}
      />
      <Button
        label="Explorar Listas"
        variant="outline"
        onPress={() => router.push('/(tabs)/explore')}
      />
      <Button
        label="Test Audio"
        onPress={() => playText('Mi nombre es Juan', 'es')}
      />
    </View>
  );
}
