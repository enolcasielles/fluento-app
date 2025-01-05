import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { colors, spacing, typography, dimensions } from '../theme';
import { TextField } from '../components/base/TextField';
import { Button } from '../components/base/Button';
import { z } from 'zod';
import { useForm } from '../hooks/useForm';

// Esquema de validación
const recoverPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('El email no es válido'),
});

type RecoverPasswordForm = z.infer<typeof recoverPasswordSchema>;

export default function RecoverPassword() {
  const router = useRouter();
  
  const { values, errors, isValid, handleChange, handleSubmit } = useForm<RecoverPasswordForm>({
    initialValues: {
      email: '',
    },
    schema: recoverPasswordSchema,
  });

  const onSubmit = (data: RecoverPasswordForm) => {
    // Aquí iría la lógica de recuperación de contraseña
    console.log('Form válido:', data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Recuperar Contraseña</Text>
        
        <Text style={styles.description}>
          Introduce tu email y te enviaremos las instrucciones para recuperar tu contraseña.
        </Text>
        
        <View style={styles.form}>
          <TextField
            label="Email"
            value={values.email}
            onChange={(value) => handleChange('email', value)}
            placeholder="correo@ejemplo.com"
            type="email"
            error={errors.email}
          />

          <Button
            label="Enviar Instrucciones"
            onPress={() => handleSubmit(onSubmit)}
            disabled={!isValid}
          />
        </View>

        <View style={styles.links}>
          <Link href="/login" replace asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Volver a Iniciar Sesión</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    maxWidth: dimensions.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.lg,
  },
  links: {
    marginTop: spacing.xl,
    gap: spacing.md,
    alignItems: 'center',
  },
  link: {
    color: colors.textLink,
    fontSize: typography.body.fontSize,
    fontWeight: typography.medium,
  },
}); 