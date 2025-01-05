import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { colors, spacing, typography, dimensions, borders, borderRadius } from '../../theme';
import Svg, { Path } from 'react-native-svg';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

const ChevronIcon = () => (
  <Svg width="12" height="8" viewBox="0 0 12 8" fill="none">
    <Path
      d="M1.41 0.295013L6 4.87501L10.59 0.295013L12 1.70501L6 7.70501L0 1.70501L1.41 0.295013Z"
      fill={colors.textSecondary}
    />
  </Svg>
);

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  placeholder = 'Selecciona una opción',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const getBorderColor = () => {
    if (error) return colors.error;
    if (disabled) return colors.disabledText;
    return colors.border;
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.select,
          {
            borderColor: getBorderColor(),
            backgroundColor: disabled ? colors.disabled : colors.background,
          },
        ]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.selectText,
            !selectedOption && styles.placeholder,
            disabled && styles.textDisabled,
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronIcon />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal visible={isOpen} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsOpen(false)}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.optionsList}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    option.value === value && styles.optionSelected,
                  ]}
                  onPress={() => handleSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      option.value === value && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.medium,
    color: colors.textPrimary,
  },
  select: {
    height: dimensions.touchableHeight,
    borderWidth: borders.width.thin,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
  },
  placeholder: {
    color: colors.placeholder,
  },
  textDisabled: {
    color: colors.disabledText,
  },
  errorText: {
    fontSize: typography.bodySmall.fontSize,
    color: colors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.large,
    borderTopRightRadius: borderRadius.large,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: borders.width.thin,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  closeButton: {
    padding: spacing.sm,
  },
  closeButtonText: {
    fontSize: typography.body.fontSize,
    color: colors.primary,
    fontWeight: typography.medium,
  },
  optionsList: {
    padding: spacing.md,
  },
  option: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.medium,
  },
  optionSelected: {
    backgroundColor: colors.primaryLight + '20', // 20% opacity
  },
  optionText: {
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: typography.medium,
  },
}); 