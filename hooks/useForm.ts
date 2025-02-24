import { useState, useMemo } from 'react';
import { z } from 'zod';

interface UseFormOptions<T> {
  initialValues: T;
  schema: z.ZodType<T>;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isValid: boolean;
  handleChange: <K extends keyof T>(field: K, value: T[K]) => void;
  handleSubmit: (onSubmit: (values: T) => void) => void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  schema,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Validar si el formulario es válido
  const isValid = useMemo(() => {
    if (!hasSubmitted) {
      return Object.values(values).every(value => 
        typeof value === 'string' ? value.length > 0 : value !== undefined
      );
    }
    const result = schema.safeParse(values);
    return result.success;
  }, [values, hasSubmitted, schema]);

  // Manejar cambios en los campos
  const handleChange = <K extends keyof T>(field: K, value: T[K]) => {
    const newValues = { ...values, [field]: value };
    setValues(newValues);

    // Solo validamos si ya se ha intentado enviar el formulario
    if (hasSubmitted) {
      const fieldSchema = (schema as any).shape[field];
      const result = fieldSchema.safeParse(value);
      
      if (!result.success) {
        setErrors(prev => ({
          ...prev,
          [field]: result.error.errors[0].message,
        }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = (onSubmit: (values: T) => void) => {
    setHasSubmitted(true);
    const result = schema.safeParse(values);
    
    if (!result.success) {
      const formErrors: Partial<Record<keyof T, string>> = {};
      result.error.errors.forEach((error) => {
        const path = error.path[0] as keyof T;
        formErrors[path] = error.message;
      });
      setErrors(formErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
  };

  return {
    values,
    errors,
    isValid,
    handleChange,
    handleSubmit,
  };
} 