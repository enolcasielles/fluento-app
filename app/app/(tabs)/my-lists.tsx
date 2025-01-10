import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors, spacing, typography } from '../../theme';
import { ListCard } from '../../components/base/ListCard';
import { useApiContext } from '@/contexts/api.context';
import { useError } from '@/contexts/error.context';
import { CustomError } from '@/utils/custom-error';
import { Button } from '@/components/base/Button';
import { MyList } from '@/types/my-lists';

const EmptyState = ({ onCreateList }: { onCreateList: () => void }) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyTitle}>No has creado ninguna lista</Text>
    <Text style={styles.emptyDescription}>
      Crea tu primera lista personalizada para practicar exactamente lo que necesitas
    </Text>
    <View style={styles.emptyAction}>
      <Button
        label="Crear Lista"
        onPress={onCreateList}
      />
    </View>
  </View>
);

export default function MyLists() {
  const router = useRouter();
  const { showError } = useError();
  const { getMyLists } = useApiContext();
  const [lists, setLists] = useState<MyList[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyLists = async () => {
    try {
      if (isInitialLoading) {
        setIsInitialLoading(false);
        setIsLoading(true);
      }
      const data = await getMyLists();
      setLists(data.lists);
    } catch (error) {
      showError(error as CustomError);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchMyLists();
    }, [isInitialLoading])
  );

  const handleCreateList = () => {
    router.push('/create');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (lists.length === 0) {
    return <EmptyState onCreateList={handleCreateList} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={lists}
        style={styles.list}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <ListCard
            title={item.name}
            description={item.description}
            image={item.imageUrl}
            difficultyLabel={item.difficultyLabel}
            statusLabel={item.creationStatusLabel}
            onPress={() => router.push(`/lists/${item.id}`)}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    flex: 1,
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
    marginBottom: spacing.xl,
  },
  emptyAction: {
    width: '100%',
    maxWidth: 200,
  },
}); 