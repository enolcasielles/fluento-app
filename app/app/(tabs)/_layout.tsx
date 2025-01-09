import { Tabs } from 'expo-router';
import { colors, typography } from '../../theme';

export default function TabsLayout() {
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
        name="saved"
        options={{
          title: 'Guardadas',
          tabBarLabel: 'Guardadas',
          headerTitle: 'Listas Guardadas',
        }}
      />
      <Tabs.Screen
        name="my-lists"
        options={{
          title: 'Mis Listas',
          tabBarLabel: 'Mis Listas',
          headerTitle: 'Mis Listas',
        }}
      />
    </Tabs>
  );
} 