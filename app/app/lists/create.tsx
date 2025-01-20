import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

import { TextField } from '@/components/base/TextField';
import { Select } from '@/components/base/Select';
import { Button } from '@/components/base/Button';
import { useApiContext } from '@/contexts/api.context';
import { useForm } from '@/hooks/useForm';
import { colors, spacing, typography } from '@/theme';
import { z } from 'zod';
import { CreateListRequest } from '@/types/create-list';
import { Difficulty } from '@/enums/difficulty.enum';
import { useError } from '@/contexts/error.context';
import { CustomError } from '@/utils/custom-error';
import { ScreenContainer } from '@/components/layouts/ScreenContainer';

const createListFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  topic: z.string().optional(),
  difficulty: z.string().optional(),
  grammarStructures: z.string().optional(),
});

export type CreateListForm = z.infer<typeof createListFormSchema>;

const DIFFICULTY_OPTIONS = [
  { value: Difficulty.ANY, label: 'Cualquiera' },
  { value: Difficulty.BEGINNER, label: 'Principiante' },
  { value: Difficulty.INTERMEDIATE, label: 'Intermedio' },
  { value: Difficulty.ADVANCED, label: 'Avanzado' },
];

const BackIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
      fill={colors.textSecondary}
    />
  </Svg>
);

export default function CreateList() {
  const { showError } = useError();
  const { createList } = useApiContext();
  const [loading, setLoading] = useState(false);

  // Referencias para los campos
  const topicFieldRef = useRef<TextInput>(null);
  const grammarStructuresFieldRef = useRef<TextInput>(null);

  const { values, errors, handleChange, handleSubmit } = useForm<CreateListForm>({
    initialValues: {
      name: '',
      topic: '',
      difficulty: Difficulty.ANY,
      grammarStructures: '',
    },
    schema: createListFormSchema,
  });

  const onSubmit = async (formValues: CreateListForm) => {
    try {
      setLoading(true);
      const request: CreateListRequest = {
        name: formValues.name,
        topic: formValues.topic,
        difficulty: formValues.difficulty as Difficulty,
        grammarStructures: formValues.grammarStructures,
      };
      await createList(request);
      router.push('/my-lists');
    } catch (error) {
      showError(error as CustomError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
       <ScrollView style={styles.container}>
          <View style={styles.inner}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <BackIcon />
              <Text style={styles.backText}>Volver</Text>
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.title}>Crear nueva lista</Text>
              <Text style={styles.description}>
                Personaliza tu lista de práctica definiendo sus características. Las unidades de la lista se generará automáticamente basándose en los parámetros que especifiques.
              </Text>
            </View>

            <View style={styles.form}>
              <TextField
                label="Nombre"
                value={values.name}
                onChange={(value) => handleChange('name', value)}
                error={errors.name}
                placeholder="Ej: Verbos irregulares"
                returnKeyType="next"
                nextFieldRef={topicFieldRef}
              />

              <TextField
                ref={topicFieldRef}
                label="Temática"
                value={values.topic}
                onChange={(value) => handleChange('topic', value)}
                error={errors.topic}
                placeholder="Ej: Gramática"
                returnKeyType="next"
                nextFieldRef={grammarStructuresFieldRef}
              />

              <Select
                label="Dificultad"
                value={values.difficulty}
                onChange={(value) => handleChange('difficulty', value as Difficulty)}
                options={DIFFICULTY_OPTIONS}
                error={errors.difficulty}
              />

              <TextField
                ref={grammarStructuresFieldRef}
                label="Estructuras gramaticales"
                value={values.grammarStructures}
                onChange={(value) => handleChange('grammarStructures', value)}
                error={errors.grammarStructures}
                placeholder="Ej: Present Perfect, Past Simple"
                returnKeyType="send"
                onSubmit={() => handleSubmit(onSubmit)}
              />
            </View>

            <View style={styles.footer}>
              <Button
                label="Crear lista"
                onPress={() => handleSubmit(onSubmit)}
                loading={loading}
                disabled={loading}
              />
            </View>
          </View>
       </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
  },
  header: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  description: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    lineHeight: typography.body.fontSize * 1.5,
  },
  form: {
    padding: spacing.md,
    gap: spacing.md,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.md,
    paddingBottom: 0,
  },
  backText: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
  },
}); 