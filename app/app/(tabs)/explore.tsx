import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing } from '../../theme';
import { CategorySection } from '../../components/base/CategorySection';
import { useApiContext } from '@/contexts/api.context';
import { useError } from '@/contexts/error.context';
import { CustomError } from '@/utils/custom-error';
import { ExploreCategory, ExploreList } from '@/types/explore';

export default function Explore() {
  const router = useRouter();
  const { showError } = useError();
  const { getExplore } = useApiContext();
  const [categories, setCategories] = useState<ExploreCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExplore();
  }, []);

  const fetchExplore = async () => {
    try {
      setIsLoading(true);
      const data = await getExplore();
      console.log(data);
      setCategories(data.categories);
    } catch (error) {
      showError(error as CustomError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleListPress = (list: ExploreList) => {
    router.push(`/lists/${list.id}`);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
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
          onListPress={handleListPress}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingVertical: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
}); 