import { colors, spacing } from '@/theme';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, ViewStyle } from 'react-native';

export const ScreenContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>{children}</SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  } as ViewStyle,
});