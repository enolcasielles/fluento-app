import { Stack } from "expo-router";
import { Button } from '../components/base/Button';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { ErrorModal } from "@/components/modals/ErrorModal";
import { ErrorProvider } from "@/contexts/error.context";
import { ApiProvider } from "@/contexts/api.context";
import { AuthContextProvider } from "@/contexts/auth.context";
import { SubscriptionProvider } from '@/contexts/subscription.context';

export default function RootLayout() {
  const router = useRouter();

  return (
    <ErrorProvider>
      <AuthContextProvider>
        <ApiProvider>
          <SubscriptionProvider>
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
                <Stack.Screen
                  name="(tabs)"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="lists/[id]"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="practice/[listId]"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="lists/create"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="onboarding"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="subscription"
                  options={{
                    title: 'Premium',
                    presentation: 'modal',
                  }}
                />
              </Stack>
              <ErrorModal />
            </View>
          </SubscriptionProvider>
        </ApiProvider>
      </AuthContextProvider>
    </ErrorProvider>
  );
}
