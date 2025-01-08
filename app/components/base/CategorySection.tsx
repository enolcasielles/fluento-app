import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { ListCard } from './ListCard';

export interface List {
  id: string;
  title: string;
  description: string;
  image: string;
  difficulty: string;
  status?: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
}

interface CategorySectionProps {
  title: string;
  lists: List[];
  onListPress: (list: List) => void;
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
              title={list.title}
              description={list.description}
              image={list.image}
              difficulty={list.difficulty}
              status={list.status}
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