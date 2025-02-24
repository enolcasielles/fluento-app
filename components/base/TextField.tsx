import React, { useState, RefObject, forwardRef } from 'react';
import { View, TextInput, Text, StyleSheet, ReturnKeyTypeOptions } from 'react-native';
import { colors, spacing, typography, dimensions, borders } from '../../theme';

type TextFieldType = 'text' | 'email' | 'password';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: TextFieldType;
  disabled?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
  nextFieldRef?: RefObject<TextInput>;
  onSubmit?: () => void;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  disabled = false,
  returnKeyType = 'default',
  nextFieldRef,
  onSubmit,
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return colors.error;
    if (isFocused) return colors.borderFocus;
    return colors.border;
  };

  const handleSubmitEditing = () => {
    if (returnKeyType === 'next' && nextFieldRef?.current) {
      nextFieldRef.current.focus();
    }
    if (returnKeyType === 'send' && onSubmit) {
      onSubmit();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={ref}
        style={[
          styles.input,
          {
            borderColor: getBorderColor(),
            backgroundColor: disabled ? colors.disabled : colors.background,
          },
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        secureTextEntry={type === 'password'}
        keyboardType={type === 'email' ? 'email-address' : 'default'}
        autoCapitalize={type === 'email' ? 'none' : 'sentences'}
        editable={!disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        returnKeyType={returnKeyType}
        onSubmitEditing={handleSubmitEditing}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.medium,
    color: colors.textPrimary,
  },
  input: {
    height: dimensions.touchableHeight,
    borderWidth: borders.width.thin,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  inputFocused: {
    borderWidth: borders.width.medium,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  errorText: {
    fontSize: typography.bodySmall.fontSize,
    color: colors.error,
  },
}); 