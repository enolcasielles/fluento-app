import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Link } from 'expo-router';
import { colors, spacing, typography, dimensions } from '../theme';
import { TextField } from '../components/base/TextField';
import { Button } from '../components/base/Button';
import { z } from 'zod';

// Esquemas de validación
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
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LoginForm, string>>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Comprobar si el formulario es válido para habilitar el botón
  const isFormValid = useMemo(() => {
    if (!hasSubmitted) {
      return Object.values(form).every(value => value.length > 0);
    }
    else {
      const result = loginSchema.safeParse(form);
      return result.success;
    }
  }, [form, hasSubmitted]);

  const handleSubmit = () => {
    setHasSubmitted(true);
    const result = loginSchema.safeParse(form);
    
    if (!result.success) {
      const formErrors: Partial<Record<keyof LoginForm, string>> = {};
      result.error.errors.forEach((error) => {
        const path = error.path[0] as keyof LoginForm;
        formErrors[path] = error.message;
      });
      setErrors(formErrors);
      return;
    }

    setErrors({});
    // Aquí iría la lógica de login
    console.log('Form válido:', result.data);
  };

  const handleFieldChange = (field: keyof LoginForm, value: string) => {
    const newForm = { ...form, [field]: value };
    setForm(newForm);

    // Solo validamos si ya se ha intentado enviar el formulario
    if (hasSubmitted) {
      const fieldSchema = loginSchema.shape[field];
      const result = fieldSchema.safeParse(value);
      
      if (!result.success) {
        setErrors(prev => ({
          ...prev,
          [field]: result.error.errors[0].message,
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          [field]: undefined,
        }));
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        
        <View style={styles.form}>
          <TextField
            label="Email"
            value={form.email}
            onChange={(value) => handleFieldChange('email', value)}
            placeholder="correo@ejemplo.com"
            type="email"
            error={errors.email}
          />

          <TextField
            label="Contraseña"
            value={form.password}
            onChange={(value) => handleFieldChange('password', value)}
            placeholder="Tu contraseña"
            type="password"
            error={errors.password}
          />

          <Button
            label="Iniciar Sesión"
            onPress={handleSubmit}
            disabled={!isFormValid}
          />
        </View>

        <View style={styles.links}>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/recover-password" asChild>
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