import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing, typography } from '../../theme';
import { Button } from '../../components/base/Button';
import { useApiContext } from '@/contexts/api.context';
import { useError } from '@/contexts/error.context';
import { CustomError } from '@/utils/custom-error';
import { ListDetail } from '@/types/list-detail';
import { CreationStatus } from '@/enums/creation-status.enum';
import Svg, { Path } from 'react-native-svg';
import { BUTTON_HEIGHT } from '@/components/base/Button';
import { useFetch } from '@/hooks/useFetch';
import { ScreenContainer } from '@/components/layouts/ScreenContainer';

const FOOTER_HEIGHT = spacing.lg + BUTTON_HEIGHT + spacing.lg

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={filled ? colors.error : 'none'}
      stroke={filled ? colors.error : colors.textSecondary}
      strokeWidth={2}
    />
  </Svg>
);

const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
      fill={colors.background}
    />
  </Svg>
);

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { showError } = useError();
  const { getListDetail, saveList, deleteSavedList, retryCreateList } = useApiContext();
  const [list, setList] = useState<ListDetail>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const { isLoading, refetch } = useFetch({
    action: async () => {
      const data = await getListDetail(id as string);
      setList(data);
    },
  });

  const handleToggleSave = async () => {
    if (!list) return;
    try {
      setIsSaving(true);
      if (list.isSaved) {
        await deleteSavedList(list.id);
      } else {
        await saveList(list.id);
      }
      setList({ ...list, isSaved: !list.isSaved });
    } catch (error) {
      showError(error as CustomError);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePractice = () => {
    if (!list) return;
    router.push(`/practice/${list.id}`);
  };

  const handleRetryCreate = async () => {
    if (!list) return;
    try {
      setIsRetrying(true);
      await retryCreateList(list.id);
      refetch();
    } catch (error) {
      showError(error as CustomError);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleContactSupport = () => {
    // TODO: Implementar envío de email
    console.log('Contact support');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!list) return null;

  return (
    <ScreenContainer>
        <ScrollView style={styles.scrollView}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: list.imageUrl }} style={styles.image} />
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <BackIcon />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleToggleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={colors.error} />
              ) : (
                <HeartIcon filled={list.isSaved} />
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.title}>{list.name}</Text>

            {list.creationStatus === CreationStatus.FAILED && (
              <View style={styles.errorSection}>
                <Text style={styles.errorTitle}>Lo sentimos</Text>
                <Text style={styles.errorText}>
                  Ha ocurrido un error al generar esta lista. Puedes intentar crearla de nuevo o contactar con soporte.
                </Text>
                <View style={styles.errorActions}>
                  <Button
                    label="Reintentar"
                    onPress={handleRetryCreate}
                    loading={isRetrying}
                  />
                  <Button
                    label="Contactar Soporte"
                    variant="outline"
                    onPress={handleContactSupport}
                  />
                </View>
              </View>
            )}

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Información</Text>
              <View style={styles.infoGrid}>
                <InfoItem icon="DIFFICULTY" label="Dificultad" value={list.difficultyLabel} />
                <InfoItem icon="TOPIC" label="Temática" value={list.topic} />
                <InfoItem icon="UNITS" label="Unidades" value={list.totalUnits.toString()} />
                <InfoItem icon="GRAMMAR" label="Gramática" value={list.grammarStructures} />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.description}>{list.description}</Text>
            </View>

            {list.userProgress && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tus Resultados</Text>
                <View style={styles.resultsGrid}>
                  <ResultItem 
                    label="Unidades Practicadas" 
                    value={`${list.userProgress.practicedUnits.toString()}`} 
                  />
                  <ResultItem 
                    label="Unidades Superadas" 
                    value={list.userProgress.passedUnits.toString()} 
                  />
                  <ResultItem 
                    label="Puntuación Media" 
                    value={list.userProgress.averageScore.toString()} 
                  />
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label="Practicar"
          onPress={handlePractice}
        />
      </View>
    </ScreenContainer>
  );
}

type InfoItemProps = {
  icon: 'DIFFICULTY' | 'TOPIC' | 'UNITS' | 'GRAMMAR';
  label: string;
  value: string;
};

const InfoItem = ({ icon, label, value }: InfoItemProps) => (
  <View style={styles.infoItem}>
    <View style={styles.infoIconContainer}>
      {icon === 'DIFFICULTY' && <Text style={styles.infoIcon}>🎯</Text>}
      {icon === 'TOPIC' && <Text style={styles.infoIcon}>📚</Text>}
      {icon === 'UNITS' && <Text style={styles.infoIcon}>📝</Text>}
      {icon === 'GRAMMAR' && <Text style={styles.infoIcon}>✏️</Text>}
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const ResultItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.resultItem}>
    <Text style={styles.resultValue}>{value}</Text>
    <Text style={styles.resultLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.surface,
  },
  backButton: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.xl,
    paddingBottom: FOOTER_HEIGHT + spacing.lg,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  infoSection: {
    gap: spacing.md,
  },
  infoGrid: {
    gap: spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.md,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.bodySmall.fontSize,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  infoValue: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  grammarItem: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  errorSection: {
    backgroundColor: colors.errorLight,
    padding: spacing.lg,
    borderRadius: 8,
    gap: spacing.md,
  },
  errorTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.semibold,
    color: colors.error,
  },
  errorText: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
  },
  errorActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  resultItem: {
    flex: 1,
    minWidth: 150,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    gap: spacing.xs,
  },
  resultValue: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.bold,
    color: colors.primary,
  },
  resultLabel: {
    fontSize: typography.bodySmall.fontSize,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: FOOTER_HEIGHT,
  },
}); 