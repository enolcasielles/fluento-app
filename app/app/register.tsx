import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { colors, spacing, typography, dimensions } from '../theme';
import { TextField } from '../components/base/TextField';
import { Button } from '../components/base/Button';
import { Checkbox } from '../components/base/Checkbox';
import { z } from 'zod';
import { useForm } from '../hooks/useForm';

// Esquema de validación
const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
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
  confirmPassword: z
    .string()
    .min(1, 'Debes confirmar la contraseña'),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, 'Debes aceptar los términos y condiciones'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const router = useRouter();
  
  const { values, errors, isValid, handleChange, handleSubmit } = useForm<RegisterForm>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
    schema: registerSchema,
  });

  const onSubmit = (data: RegisterForm) => {
    // Aquí iría la lógica de registro
    console.log('Form válido:', data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Crear Cuenta</Text>
        
        <View style={styles.form}>
          <TextField
            label="Nombre"
            value={values.name}
            onChange={(value) => handleChange('name', value)}
            placeholder="Tu nombre"
            error={errors.name}
          />

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

          <TextField
            label="Confirma tu contraseña"
            value={values.confirmPassword}
            onChange={(value) => handleChange('confirmPassword', value)}
            placeholder="Repite tu contraseña"
            type="password"
            error={errors.confirmPassword}
          />

          <Checkbox
            label="Acepto los términos y condiciones"
            checked={values.acceptTerms}
            onChange={(checked) => handleChange('acceptTerms', checked)}
            error={errors.acceptTerms}
          />

          <Button
            label="Crear Cuenta"
            onPress={() => handleSubmit(onSubmit)}
            disabled={!isValid}
          />
        </View>

        <View style={styles.links}>
          <Link href="/login" replace asChild>
            <TouchableOpacity>
              <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
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