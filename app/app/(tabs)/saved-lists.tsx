import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '../../theme';
import { ListCard } from '../../components/base/ListCard';
import { useApiContext } from '@/contexts/api.context';
import { SavedList } from '@/types/saved-list';
import { useFetch } from '@/hooks/useFetch';
import { ScreenContainer } from '@/components/layouts/ScreenContainer';

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
  const { getSavedLists } = useApiContext();
  const [lists, setLists] = useState<SavedList[]>([]);

  const { isLoading } = useFetch({
    action: async () => {
      const data = await getSavedLists();
      setLists(data.lists);
    },
  });

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
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Listas Guardadas</Text>
        <Text style={styles.description}>
          Aquí podrás ver todas las listas que has guardado.
        </Text>
      </View>
      <FlatList
        data={lists}
        style={styles.container}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <ListCard
            title={item.name}
            description={item.description}
            image={item.imageUrl}
            difficultyLabel={item.difficultyLabel}
            onPress={() => router.push(`/lists/${item.id}`)}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
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
    padding: spacing.lg,
    paddingTop: 0,
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