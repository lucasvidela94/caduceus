import { z } from "zod";

export const patientSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras y espacios")
});

export type PatientInput = z.infer<typeof patientSchema>;

export const validatePatient = (data: unknown): { success: true; data: PatientInput } | { success: false; errors: string[] } => {
  const result = patientSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: result.error.issues.map((issue) => issue.message)
  };
};
