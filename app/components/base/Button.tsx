import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'icon';

export const BUTTON_HEIGHT = 48;

interface ButtonProps {
  variant?: ButtonVariant;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  label,
  onPress,
  disabled = false,
  loading = false,
  icon
}) => {
  const getBackgroundColor = () => {
    if (disabled) return colors.disabled;
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'outline':
      case 'text':
        return 'transparent';
      case 'icon':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.disabledText;
    switch (variant) {
      case 'primary':
      case 'secondary':
        return colors.background;
      case 'outline':
      case 'text':
        return colors.primary;
      default:
        return colors.background;
    }
  };

  const getBorderColor = () => {
    if (disabled) return colors.disabled;
    switch (variant) {
      case 'outline':
        return colors.primary;
      default:
        return 'transparent';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
        variant === 'outline' && styles.outlineButton,
        disabled && styles.disabled
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          {variant !== 'icon' && <Text style={[styles.label, { color: getTextColor() }]}>{label}</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: BUTTON_HEIGHT,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  outlineButton: {
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  label: {
    fontSize: typography.bodyLarge.fontSize,
    fontWeight: typography.medium,
    textAlign: 'center',
  },
}); 