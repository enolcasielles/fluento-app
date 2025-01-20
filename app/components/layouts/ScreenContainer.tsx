import { colors } from '@/theme';
import { SafeAreaView, StyleSheet, ViewStyle } from 'react-native';
import KeyboardAvoidingView from '../utils/KeyboardAvoidingView';

export const ScreenContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <KeyboardAvoidingView>
      <SafeAreaView style={styles.container}>
          {children}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle,
});