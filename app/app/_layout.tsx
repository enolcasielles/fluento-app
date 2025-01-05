import { Stack } from "expo-router";
import { Button } from '../components/base/Button';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Fluento',
          }}
        />
        <Stack.Screen
          name="design-system"
          options={{
            title: 'Design System',
            headerRight: () => (
              <Button
                variant="text"
                label="Cerrar"
                onPress={() => router.back()}
              />
            ),
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            title: 'Iniciar Sesión',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            title: 'Registro',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="recover-password"
          options={{
            title: 'Recuperar Contraseña',
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
}
