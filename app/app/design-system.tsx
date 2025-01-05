import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Button } from '../components/base/Button';
import { TextField } from '../components/base/TextField';
import { Checkbox } from '../components/base/Checkbox';
import { Select } from '../components/base/Select';

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Principiante' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
];

const THEME_OPTIONS = [
  { value: 'daily', label: 'Vida diaria' },
  { value: 'work', label: 'Trabajo' },
  { value: 'travel', label: 'Viajes' },
  { value: 'food', label: 'Comida' },
  { value: 'hobbies', label: 'Hobbies' },
  { value: 'culture', label: 'Cultura' },
];

export default function DesignSystem() {
  const [textFieldValues, setTextFieldValues] = useState({
    normal: '',
    email: '',
    password: '',
    error: '',
    disabled: '',
  });

  const [checkboxValues, setCheckboxValues] = useState({
    normal: false,
    checked: true,
    disabled: false,
    disabledChecked: true,
    error: false,
  });

  const [selectValues, setSelectValues] = useState({
    normal: '',
    withValue: 'intermediate',
    disabled: '',
    error: '',
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Design System</Text>

      {/* Selects */}
      <Section title="Selects">
        <Select
          label="Select normal"
          value={selectValues.normal}
          onChange={(value) => setSelectValues(prev => ({ ...prev, normal: value }))}
          options={THEME_OPTIONS}
          placeholder="Selecciona un tema"
        />
        <Select
          label="Select con valor"
          value={selectValues.withValue}
          onChange={(value) => setSelectValues(prev => ({ ...prev, withValue: value }))}
          options={DIFFICULTY_OPTIONS}
        />
        <Select
          label="Select deshabilitado"
          value={selectValues.disabled}
          onChange={(value) => setSelectValues(prev => ({ ...prev, disabled: value }))}
          options={DIFFICULTY_OPTIONS}
          disabled
        />
        <Select
          label="Select con error"
          value={selectValues.error}
          onChange={(value) => setSelectValues(prev => ({ ...prev, error: value }))}
          options={DIFFICULTY_OPTIONS}
          error="Este campo es requerido"
        />
      </Section>

      {/* Checkboxes */}
      <Section title="Checkboxes">
        <Checkbox
          label="Checkbox normal"
          checked={checkboxValues.normal}
          onChange={(checked) => setCheckboxValues(prev => ({ ...prev, normal: checked }))}
        />
        <Checkbox
          label="Checkbox marcado"
          checked={checkboxValues.checked}
          onChange={(checked) => setCheckboxValues(prev => ({ ...prev, checked: checked }))}
        />
        <Checkbox
          label="Checkbox deshabilitado"
          checked={checkboxValues.disabled}
          onChange={(checked) => setCheckboxValues(prev => ({ ...prev, disabled: checked }))}
          disabled
        />
        <Checkbox
          label="Checkbox deshabilitado y marcado"
          checked={checkboxValues.disabledChecked}
          onChange={(checked) => setCheckboxValues(prev => ({ ...prev, disabledChecked: checked }))}
          disabled
        />
        <Checkbox
          label="Checkbox con error"
          checked={checkboxValues.error}
          onChange={(checked) => setCheckboxValues(prev => ({ ...prev, error: checked }))}
          error="Este checkbox tiene un error"
        />
      </Section>

      {/* Campos de Texto */}
      <Section title="Campos de Texto">
        <TextField
          label="Campo de texto normal"
          value={textFieldValues.normal}
          onChange={(value) => setTextFieldValues(prev => ({ ...prev, normal: value }))}
          placeholder="Escribe algo..."
        />
        <TextField
          label="Campo de email"
          value={textFieldValues.email}
          onChange={(value) => setTextFieldValues(prev => ({ ...prev, email: value }))}
          placeholder="correo@ejemplo.com"
          type="email"
        />
        <TextField
          label="Campo de contraseña"
          value={textFieldValues.password}
          onChange={(value) => setTextFieldValues(prev => ({ ...prev, password: value }))}
          placeholder="Tu contraseña"
          type="password"
        />
        <TextField
          label="Campo con error"
          value={textFieldValues.error}
          onChange={(value) => setTextFieldValues(prev => ({ ...prev, error: value }))}
          placeholder="Campo con error"
          error="Este campo contiene un error"
        />
        <TextField
          label="Campo deshabilitado"
          value={textFieldValues.disabled}
          onChange={(value) => setTextFieldValues(prev => ({ ...prev, disabled: value }))}
          placeholder="No puedes escribir aquí"
          disabled
        />
      </Section>

      {/* Colores */}
      <Section title="Colores">
        <View style={styles.colorGrid}>
          {Object.entries(colors).map(([name, value]) => (
            <View key={name} style={styles.colorItem}>
              <View style={[styles.colorSwatch, { backgroundColor: value }]} />
              <Text style={styles.colorName}>{name}</Text>
              <Text style={styles.colorValue}>{value}</Text>
            </View>
          ))}
        </View>
      </Section>

      {/* Tipografía */}
      <Section title="Tipografía">
        <Text style={[styles.text, { fontSize: typography.h1.fontSize, fontWeight: typography.h1.fontWeight }]}>
          Heading 1
        </Text>
        <Text style={[styles.text, { fontSize: typography.h2.fontSize, fontWeight: typography.h2.fontWeight }]}>
          Heading 2
        </Text>
        <Text style={[styles.text, { fontSize: typography.h3.fontSize, fontWeight: typography.h3.fontWeight }]}>
          Heading 3
        </Text>
        <Text style={[styles.text, { fontSize: typography.bodyLarge.fontSize }]}>
          Body Large - Lorem ipsum dolor sit amet
        </Text>
        <Text style={[styles.text, { fontSize: typography.body.fontSize }]}>
          Body - Lorem ipsum dolor sit amet
        </Text>
        <Text style={[styles.text, { fontSize: typography.bodySmall.fontSize }]}>
          Body Small - Lorem ipsum dolor sit amet
        </Text>
      </Section>

      {/* Botones */}
      <Section title="Botones">
        <View style={styles.buttonContainer}>
          <Button label="Primary Button" onPress={() => {}} />
          <View style={styles.spacing} />
          <Button label="Secondary Button" variant="secondary" onPress={() => {}} />
          <View style={styles.spacing} />
          <Button label="Outline Button" variant="outline" onPress={() => {}} />
          <View style={styles.spacing} />
          <Button label="Text Button" variant="text" onPress={() => {}} />
          <View style={styles.spacing} />
          <Button label="Disabled Button" disabled onPress={() => {}} />
          <View style={styles.spacing} />
          <Button label="Loading Button" loading onPress={() => {}} />
        </View>
      </Section>

      {/* Espaciado */}
      <Section title="Espaciado">
        <View style={styles.spacingContainer}>
          {Object.entries(spacing).map(([name, value]) => (
            <View key={name} style={styles.spacingItem}>
              <View style={[styles.spacingBox, { width: value, height: value }]} />
              <Text style={styles.spacingText}>{name} ({value}px)</Text>
            </View>
          ))}
        </View>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pageTitle: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    padding: spacing.lg,
  },
  section: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sectionContent: {
    gap: spacing.md,
  },
  text: {
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  colorItem: {
    width: 100,
    marginBottom: spacing.md,
  },
  colorSwatch: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  colorName: {
    fontSize: typography.bodySmall.fontSize,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  colorValue: {
    fontSize: typography.bodySmall.fontSize,
    color: colors.textTertiary,
  },
  buttonContainer: {
    gap: spacing.md,
  },
  spacing: {
    height: spacing.md,
  },
  spacingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  spacingItem: {
    alignItems: 'center',
  },
  spacingBox: {
    backgroundColor: colors.primary,
    marginBottom: spacing.xs,
  },
  spacingText: {
    fontSize: typography.bodySmall.fontSize,
    color: colors.textSecondary,
  },
}); 