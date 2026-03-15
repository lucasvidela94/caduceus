import { z } from "zod";

export const patientSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras y espacios"),
  email: z
    .string()
    .email("El email no es válido")
    .max(100, "El email no puede tener más de 100 caracteres")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]{7,20}$/, "El teléfono no es válido")
    .max(20, "El teléfono no puede tener más de 20 caracteres")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(255, "La dirección no puede tener más de 255 caracteres")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(2000, "Las notas no pueden tener más de 2000 caracteres")
    .optional()
    .or(z.literal(""))
});

export type PatientFormData = z.infer<typeof patientSchema>;

export const validatePatient = (data: unknown): { success: true; data: PatientFormData } | { success: false; errors: string[] } => {
  const result = patientSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: result.error.issues.map((issue) => issue.message)
  };
};