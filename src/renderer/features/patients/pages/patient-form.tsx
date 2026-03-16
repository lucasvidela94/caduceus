import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { PageHeader } from "@/shared/components/page-header";
import { PageContainer } from "@/shared/components/page-container";
import { ROUTES, BREADCRUMB_MAP } from "@/shared/lib/routes";
import { validatePatient } from "@/shared/lib/validation";
import { patientService } from "@/services";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

export const PatientForm = (): ReactElement => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: ""
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const handleChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrors([]);
    setMessage(null);

    const validation = validatePatient(formData);

    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    try {
      const patient = await patientService.create({
        name: validation.data.name,
        email: validation.data.email || undefined,
        phone: validation.data.phone || undefined,
        address: validation.data.address || undefined,
        notes: validation.data.notes || undefined
      });
      setMessage({
        type: "success",
        text: `Paciente ${patient.name} guardado con ID ${patient.id}`
      });
      setFormData({ name: "", email: "", phone: "", address: "", notes: "" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error desconocido"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Breadcrumb items={BREADCRUMB_MAP[ROUTES.PATIENTS.NEW]} />

      <PageHeader
        title="Nuevo Paciente"
        description="Completa los datos para registrar un nuevo paciente"
      />

      <Card>
        <CardHeader>
          <CardTitle>Información del Paciente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nombre completo *
              </label>
              <Input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ingrese el nombre del paciente"
                disabled={loading}
                className={errors.some((e) => e.includes("nombre")) ? "border-destructive" : ""}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="paciente@email.com"
                  disabled={loading}
                  className={errors.some((e) => e.includes("email")) ? "border-destructive" : ""}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Teléfono
                </label>
                <Input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+54 11 1234-5678"
                  disabled={loading}
                  className={errors.some((e) => e.includes("teléfono")) ? "border-destructive" : ""}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Dirección
              </label>
              <Input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Calle, número, ciudad"
                disabled={loading}
                className={errors.some((e) => e.includes("dirección")) ? "border-destructive" : ""}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notas
              </label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Observaciones médicas, alergias, historial, etc."
                disabled={loading}
                rows={4}
                className={errors.some((e) => e.includes("notas")) ? "border-destructive" : ""}
              />
            </div>

            {errors.length > 0 && (
              <div className="text-sm text-destructive space-y-1">
                {errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(ROUTES.PATIENTS.LIST)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Paciente"}
              </Button>
            </div>
          </form>

          {message !== null && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {message.text}
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
};
