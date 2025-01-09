import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors, spacing } from '../../theme';
import { ListCard } from '../../components/base/ListCard';
import { useApiContext } from '@/contexts/api.context';
import { useError } from '@/contexts/error.context';
import { CustomError } from '@/utils/custom-error';
import { SavedList } from '@/types/saved-list';

export default function SavedLists() {
  const router = useRouter();
  const { showError } = useError();
  const { getSavedLists } = useApiContext();
  const [lists, setLists] = useState<SavedList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSavedLists = async () => {
    try {
      setIsLoading(true);
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
    }, [])
  );

  const handleListPress = (list: SavedList) => {
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
          onPress={() => handleListPress(item)}
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
}); 