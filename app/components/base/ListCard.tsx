import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';

type ListStatus = 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

interface ListCardProps {
  title: string;
  description: string;
  image: string;
  difficulty: string;
  status?: ListStatus;
  onPress: () => void;
}

const getStatusColor = (status?: ListStatus) => {
  switch (status) {
    case 'COMPLETED':
      return colors.success;
    case 'FAILED':
      return colors.error;
    case 'IN_PROGRESS':
      return colors.info;
    default:
      return undefined;
  }
};

const getStatusLabel = (status?: ListStatus) => {
  switch (status) {
    case 'COMPLETED':
      return 'Completada';
    case 'FAILED':
      return 'Error';
    case 'IN_PROGRESS':
      return 'En Progreso';
    default:
      return undefined;
  }
};

export const ListCard: React.FC<ListCardProps> = ({
  title,
  description,
  image,
  difficulty,
  status,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, shadows.md]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: image }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {status && (
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
              <Text style={styles.statusText}>{getStatusLabel(status)}</Text>
            </View>
          )}
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>{difficulty}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.large,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.xs,
    marginVertical: spacing.xs,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: colors.surface,
  },
  content: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: typography.h3.fontSize,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.medium,
  },
  statusText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: typography.medium,
    color: colors.background,
  },
  description: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  difficultyBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.medium,
  },
  difficultyText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: typography.medium,
    color: colors.textSecondary,
  },
}); 