import { Tabs } from 'expo-router';
import { colors, typography } from '../../theme';
import { Button } from '@/components/base/Button';
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
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
          tabBarIcon: ({ color, size }) => (
            <SimpleLineIcons name="compass" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-lists"
        options={{
          title: 'Mis Listas',
          tabBarLabel: 'Mis Listas',
          headerTitle: 'Mis Listas',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="bars" size={size} color={color} />
          ),
          headerRight: () => (
            <Button
              variant="text"
              label='Nueva'
              icon={<AntDesign name="plus" size={24} color={colors.primary} />}
              onPress={() => router.push('/lists/create')}
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
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="hearto" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 