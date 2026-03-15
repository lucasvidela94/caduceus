import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { PageHeader } from "@/shared/components/page-header";
import { PageContainer } from "@/shared/components/page-container";
import { ROUTES, BREADCRUMB_MAP } from "@/shared/lib/routes";
import { validatePatient } from "@/shared/lib/validation";

export const PatientForm = (): ReactElement => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrors([]);
    setMessage(null);

    const validation = validatePatient({ name });

    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    try {
      const patient = await window.electronAPI.addPatient(validation.data.name);
      setMessage({
        type: "success",
        text: `Paciente ${patient.name} guardado con ID ${patient.id}`
      });
      setName("");
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
                Nombre completo
              </label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors([]);
                }}
                placeholder="Ingrese el nombre del paciente"
                disabled={loading}
                className={errors.length > 0 ? "border-destructive" : ""}
              />
              {errors.length > 0 && (
                <div className="text-sm text-destructive space-y-1">
                  {errors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>

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
