import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '../../theme';
import { CategorySection } from '../../components/base/CategorySection';
import { useApiContext } from '@/contexts/api.context';
import { ExploreCategory } from '@/types/explore';
import { useFetch } from '@/hooks/useFetch';
import { ScreenContainer } from '@/components/layouts/ScreenContainer';

export default function Explore() {
  const router = useRouter();
  const { getExplore } = useApiContext();
  const [categories, setCategories] = useState<ExploreCategory[]>([]);

  const { isLoading } = useFetch({
    action: async () => {
      const data = await getExplore();
      setCategories(data.categories);
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Explorar</Text>
        <Text style={styles.description}>
          Explora las listas que hemos creado para tí. Practica con aquellas que te interesen.
        </Text>
      </View>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((category) => (
          <CategorySection
            key={category.id}
            title={category.name}
            lists={category.lists}
            onListPress={(list) => router.push(`/lists/${list.id}`)}
          />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  description: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    lineHeight: typography.body.fontSize * 1.5,
  },
  content: {
    paddingVertical: spacing.lg,
    paddingTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
}); 