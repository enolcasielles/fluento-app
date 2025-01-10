import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { colors, spacing, typography, dimensions } from '../theme';
import { TextField } from '../components/base/TextField';
import { Button } from '../components/base/Button';
import { z } from 'zod';
import { useForm } from '../hooks/useForm';
import { CustomError } from '@/utils/custom-error';
import { supabase } from '@/lib/supabase';
import { useError } from '@/contexts/error.context';
import { loginService } from '../services/auth.service';
import { useAuthContext } from '@/contexts/auth.context';

// Esquema de validación
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('El email no es válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
    .regex(/\d/, 'La contraseña debe contener al menos un número'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const { saveAuthToken } = useAuthContext();
  const { showError } = useError();
  const [loading, setLoading] = useState(false);

  const { values, errors, isValid, handleChange, handleSubmit } = useForm<LoginForm>({
    initialValues: {
      email: '',
      password: '',
    },
    schema: loginSchema,
  });

  const onSubmit = async ({email, password}: LoginForm) => {
    try {
      setLoading(true);
      const response = await loginService(email, password);
      await saveAuthToken(response.accessToken);
      router.replace('/explore');
    } catch (error) {
      showError(error as CustomError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        
        <View style={styles.form}>
          <TextField
            label="Email"
            value={values.email}
            onChange={(value) => handleChange('email', value)}
            placeholder="correo@ejemplo.com"
            type="email"
            error={errors.email}
          />

          <TextField
            label="Contraseña"
            value={values.password}
            onChange={(value) => handleChange('password', value)}
            placeholder="Tu contraseña"
            type="password"
            error={errors.password}
          />

          <Button
            label="Iniciar Sesión"
            onPress={() => handleSubmit(onSubmit)}
            disabled={!isValid}
            loading={loading}
          />
        </View>

        <View style={styles.links}>
          <Link href="/register" replace asChild>
            <TouchableOpacity>
              <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/recover-password" replace asChild>
            <TouchableOpacity>
              <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
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
    marginBottom: spacing.xl,
    textAlign: 'center',
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