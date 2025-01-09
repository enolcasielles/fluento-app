import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { ListCard } from './ListCard';
import { ExploreList } from '@/types/explore';

interface CategorySectionProps {
  title: string;
  lists: ExploreList[];
  onListPress: (list: ExploreList) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  lists,
  onListPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {lists.map((list) => (
          <View key={list.id} style={styles.cardContainer}>
            <ListCard
              title={list.name}
              description={list.description}
              image={list.imageUrl}
              difficulty={list.difficulty}
              status='COMPLETED'
              onPress={() => onListPress(list)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.lg,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg - spacing.xs, // Compensar el margen de las cards
  },
  cardContainer: {
    width: 300, // Ancho fijo para las cards
  },
}); 