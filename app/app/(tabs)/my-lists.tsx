import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '../../theme';
import { ListCard } from '../../components/base/ListCard';
import { useApiContext } from '@/contexts/api.context';
import { Button } from '@/components/base/Button';
import { MyList } from '@/types/my-lists';
import { useFetch } from '@/hooks/useFetch';
import { ScreenContainer } from '@/components/layouts/ScreenContainer';
import Svg, { Path } from 'react-native-svg';
import { usePremiumFeature } from '@/hooks/usePremiumFeature';
import { PremiumFeatureModal } from '@/components/base/PremiumFeatureModal';



const PlusIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
      fill={colors.primary}
    />
  </Svg>
);

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
  const { getMyLists } = useApiContext();
  const [lists, setLists] = useState<MyList[]>([]);

  const {
    showPremiumModal,
    hidePremiumModal,
    handleFeatureAccess,
    feature,
  } = usePremiumFeature({
    key: 'create_list',
    title: 'Crear Lista Personalizada',
    description: 'Actualiza a Premium para crear listas personalizadas ilimitadas y generar el contenido que más te interese.',
  });

  const { isLoading } = useFetch({
    action: async () => {
      const data = await getMyLists();
      setLists(data.lists);
    },
  });

  const handleCreateList = () => {
    handleFeatureAccess(() => {
      router.push('/lists/create');
    })
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  let comp = null;

  if (lists.length === 0) {
    comp = <EmptyState onCreateList={handleCreateList} />;
  }

  else comp = (
    <ScreenContainer>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Mis Listas</Text>
          <View style={styles.createButton}>
            <Button
              variant="icon"
              icon={<PlusIcon />}
              label=""
              onPress={handleCreateList}
            />
          </View>
        </View>
        <Text style={styles.description}>
          Aquí podrás ver todas las listas que has creado.
        </Text>
      </View>
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
    </ScreenContainer>
  );

  return <>
    {comp}
    <PremiumFeatureModal
      isVisible={showPremiumModal}
      onClose={hidePremiumModal}
      feature={feature}
    />
  </>
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  createButton: {
    marginRight: -spacing.md,
  },
  description: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    lineHeight: typography.body.fontSize * 1.5,
  },
  list: {
    flex: 1,
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
    marginBottom: spacing.xl,
  },
  emptyAction: {
    width: '100%',
    maxWidth: 200,
  },
}); 