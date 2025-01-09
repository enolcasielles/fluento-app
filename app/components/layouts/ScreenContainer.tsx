import { KeyboardAvoidingView, SafeAreaView } from 'react-native';

export const ScreenContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <SafeAreaView className={styles.container}>{children}</SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = {
  container: 'flex flex-1 m-6',
};
