import React from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import { Button } from '../../components/base/Button';
import { useSubscription } from '../../contexts/subscription.context';
import { colors, spacing, typography } from '../../theme';
import { ScreenContainer } from '../../components/layouts/ScreenContainer';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/contexts/auth.context';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthContext();
  const { isLoading, isSubscribed, subscriptionStatus, subscribe, cancelSubscription } = useSubscription();

  const isExpired = subscriptionStatus.cancelAtPeriodEnd;

  const handleManageSubscription = () => {
    if (!isSubscribed || isExpired) subscribe();
    else cancelSubscription();
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={48} color={colors.textSecondary} />
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Subscription Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suscripción</Text>
          <View style={styles.subscriptionCard}>
            <View style={styles.subscriptionInfo}>
              <Text style={styles.planLabel}>Plan Actual</Text>
              <Text style={styles.planType}>
                {isSubscribed ? 'Premium' : 'Free'}
              </Text>
              {isSubscribed && isExpired && (
                <Text style={styles.cancelNotice}>
                  Tu suscripción finalizará al final del período actual
                </Text>
              )}
            </View>
            <Button
              label={isSubscribed && !isExpired 
                ? 'Cancelar Suscripción' 
                : (isSubscribed ? "Reactivar suscripción" : "Actualizar a Premium")}
              onPress={handleManageSubscription}
              variant={isSubscribed && !isExpired ? 'outline' : 'primary'}
              loading={isLoading}
            />
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.footer}>
          <Button
            label="Cerrar Sesión"
            onPress={handleLogout}
            variant="text"
            textColor={colors.error}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  subscriptionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  subscriptionInfo: {
    gap: spacing.xs,
  },
  planLabel: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
  },
  planType: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  cancelNotice: {
    fontSize: typography.bodySmall.fontSize,
    color: colors.error,
    marginTop: spacing.xs,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  logoutButton: {
    color: colors.error,
  } as ViewStyle,
}); 