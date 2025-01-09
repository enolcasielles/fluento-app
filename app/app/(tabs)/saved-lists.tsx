import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors, spacing, typography } from '../../theme';
import { ListCard } from '../../components/base/ListCard';
import { useApiContext } from '@/contexts/api.context';
import { useError } from '@/contexts/error.context';
import { CustomError } from '@/utils/custom-error';
import { SavedList } from '@/types/saved-list';
import { Button } from '@/components/base/Button';

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyTitle}>No tienes listas guardadas</Text>
    <Text style={styles.emptyDescription}>
      Explora las listas disponibles y guarda las que más te interesen para practicarlas más tarde
    </Text>
  </View>
);

export default function SavedLists() {
  const router = useRouter();
  const { showError } = useError();
  const { getSavedLists } = useApiContext();
  const [lists, setLists] = useState<SavedList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const fetchSavedLists = async () => {
    try {
      if (isInitialLoading) {
        setIsInitialLoading(false);
        setIsLoading(true);
      }
      const data = await getSavedLists();
      setLists(data.lists);
    } catch (error) {
      showError(error as CustomError);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchSavedLists();
    }, [isInitialLoading])
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (lists.length === 0) {
    return <EmptyState />;
  }

  return (
    <FlatList
      data={lists}
      style={styles.container}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <ListCard
          title={item.name}
          description={item.description}
          image={item.imageUrl}
          difficulty={item.difficulty}
          onPress={() => router.push(`/lists/${item.id}`)}
        />
      )}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
}); 