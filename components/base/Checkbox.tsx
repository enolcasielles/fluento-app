import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius, borders } from '../../theme';
import Svg, { Path } from 'react-native-svg';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  error?: string;
}

const CheckIcon = () => (
  <Svg width="12" height="10" viewBox="0 0 12 10" fill="none">
    <Path
      d="M4.00001 7.80002L1.20001 5.00002L0.266675 5.93335L4.00001 9.66669L12 1.66669L11.0667 0.733353L4.00001 7.80002Z"
      fill="white"
    />
  </Svg>
);

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  error,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return colors.disabled;
    if (checked) return colors.primary;
    return colors.background;
  };

  const getBorderColor = () => {
    if (error) return colors.error;
    if (disabled) return colors.disabledText;
    if (checked) return colors.primary;
    return colors.border;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.row}
        onPress={() => !disabled && onChange(!checked)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: getBackgroundColor(),
              borderColor: getBorderColor(),
            },
          ]}
        >
          {checked && <CheckIcon />}
        </View>
        <Text
          style={[
            styles.label,
            disabled && styles.labelDisabled,
            error && styles.labelError,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const CHECKBOX_SIZE = 20;

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkbox: {
    width: CHECKBOX_SIZE,
    height: CHECKBOX_SIZE,
    borderRadius: borderRadius.small,
    borderWidth: borders.width.thin,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
  },
  labelDisabled: {
    color: colors.disabledText,
  },
  labelError: {
    color: colors.error,
  },
  errorText: {
    fontSize: typography.bodySmall.fontSize,
    color: colors.error,
    marginLeft: CHECKBOX_SIZE + spacing.sm,
  },
}); 