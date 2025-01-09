import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing, typography, dimensions } from '../../theme';
import { Button } from '../../components/base/Button';
import { useApiContext } from '@/contexts/api.context';
import { useError } from '@/contexts/error.context';
import { CustomError } from '@/utils/custom-error';
import { ListDetail } from '@/types/list-detail';
import { CreationStatus } from '@/enums/creation-status.enum';

const FOOTER_HEIGHT = 24 + 48 + 24; // padding.lg + button.height + padding.lg

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { showError } = useError();
  const { getListDetail, saveList, retryCreateList } = useApiContext();
  const [list, setList] = useState<ListDetail>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    fetchListDetail();
  }, [id]);

  const fetchListDetail = async () => {
    try {
      setIsLoading(true);
      // TODO: Implementar llamada real
      const data = await getListDetail(id as string);
      setList(data);
    } catch (error) {
      showError(error as CustomError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndPractice = async () => {
    if (!list) return;
    try {
      setIsSaving(true);
      await saveList(list.id);
      router.push(`/practice/${list.id}`);
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
      await fetchListDetail();
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

  console.log(list);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Image source={{ uri: list.imageUrl }} style={styles.image} />
        
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
              <InfoItem icon="DIFFICULTY" label="Dificultad" value={list.difficulty} />
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
        {!list.isSaved ? (
          <Button
            label="Guardar y Practicar"
            onPress={handleSaveAndPractice}
            loading={isSaving}
          />
        ) : (
          <Button
            label="Practicar"
            onPress={handlePractice}
          />
        )}
      </View>
    </View>
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
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.surface,
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