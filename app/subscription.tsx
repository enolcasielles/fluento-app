import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useSubscription } from '@/contexts/subscription.context';
import { Button } from '@/components/base/Button';
import { colors, spacing, typography } from '@/theme';
import { useRouter } from 'expo-router';
import { CustomError } from '@/utils/custom-error';
import { useError } from '@/contexts/error.context';

const PremiumFeature: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <View style={styles.featureContainer}>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </View>
);

export default function SubscriptionScreen() {
  const router = useRouter();
  const { showError } = useError();
  const { 
    isLoading, 
    isSubscribed, 
    subscriptionStatus,
    subscribe,
    cancelSubscription 
  } = useSubscription();

  const handleSubscribe = async () => {
    try {
      await subscribe();
      // Si la suscripción es exitosa, redirigir al usuario
      router.back();
    } catch (error) {
      showError(error as CustomError);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelSubscription();
      // Si la cancelación es exitosa, redirigir al usuario
      router.back();
    } catch (error) {
    showError(error as CustomError);
  }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const isExpired = subscriptionStatus?.cancelAtPeriodEnd;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Fluento Premium</Text>
        <Text style={styles.subtitle}>
          Desbloquea todo el potencial de Fluento
        </Text>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Características Premium</Text>
          <PremiumFeature
            title="Listas Ilimitadas"
            description="Crea todas las listas personalizadas que necesites"
          />
          <PremiumFeature
            title="Sin Límites"
            description="Practica tanto como quieras, sin restricciones diarias"
          />
          <PremiumFeature
            title="Autoevaluación"
            description="Deja que nuestra IA te evalúe automáticamente tus respuestas"
          />
        </View>

        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Planes Disponibles</Text>
            <View style={styles.planCard}>
              <View style={styles.planInfo}>
                <Text style={styles.planName}>Fluento Premium</Text>
                <Text style={styles.planPrice}>
                  4,99 €
                  <Text style={styles.planPeriod}>/mes</Text>
                </Text>
              </View>
              <Button
                label={isSubscribed && !isExpired ? "Cancelar Suscripción" : (isExpired ? "Reactivar Suscripción" : "Suscribirse")}
                onPress={() => isSubscribed && !isExpired ? handleCancel() : handleSubscribe()}
                variant={isSubscribed && !isExpired ? "outline" : "primary"}
              />
            </View>
        </View>

        {subscriptionStatus?.cancelAtPeriodEnd && (
          <View style={styles.cancelNotice}>
            <Text style={styles.cancelNoticeText}>
              {isSubscribed && isExpired && (
                <Text>
                  Tu suscripción terminará el {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()}
                </Text>
              )}
              {isSubscribed && !isExpired && (
                <Text>
                  Tu suscripción se renovará el {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()}
                </Text>
              )}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  featuresSection: {
    gap: spacing.md,
  },
  featureContainer: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.xs,
  },
  featureTitle: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: typography.semibold,
  },
  featureDescription: {
    ...typography.body,
    color: colors.textSecondary,
  },
  plansSection: {
    gap: spacing.md,
  },
  planCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    gap: spacing.md,
  },
  planInfo: {
    gap: spacing.xs,
  },
  planName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  planPrice: {
    ...typography.h2,
    color: colors.primary,
  },
  planPeriod: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
  },
  cancelNotice: {
    backgroundColor: colors.surfaceHover,
    padding: spacing.md,
    borderRadius: 8,
  },
  cancelNoticeText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
}); 