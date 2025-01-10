import { Tabs } from 'expo-router';
import { colors, typography } from '../../theme';
import { Button } from '@/components/base/Button';
import { useRouter } from 'expo-router';

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: typography.bodySmall.fontSize,
          fontWeight: typography.medium,
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explora',
          tabBarLabel: 'Explora',
          headerTitle: 'Explora',
        }}
      />
      <Tabs.Screen
        name="my-lists"
        options={{
          title: 'Mis Listas',
          tabBarLabel: 'Mis Listas',
          headerTitle: 'Mis Listas',
          headerRight: () => (
            <Button
              variant="text"
              label="Crear"
              onPress={() => router.push('/create')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="saved-lists"
        options={{
          title: 'Guardadas',
          tabBarLabel: 'Guardadas',
          headerTitle: 'Listas Guardadas',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarLabel: 'Perfil',
          headerTitle: 'Mi Perfil',
        }}
      />
    </Tabs>
  );
} 