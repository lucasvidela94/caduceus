import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Patient } from "@shared/types";
import type { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { PageHeader } from "@/shared/components/page-header";
import { PageContainer } from "@/shared/components/page-container";
import { LoadingState } from "@/shared/components/loading-state";
import { ROUTES } from "@/shared/lib/routes";
import { validatePatient } from "@/shared/lib/validation";
import { Mail, Phone, MapPin, Calendar, ArrowLeft, Edit2, Save, X } from "lucide-react";

export const PatientDetail = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<Patient>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    window.electronAPI
      .getPatient(id ?? "")
      .then((data) => {
        setPatient(data);
        setFormData(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (field: keyof Patient, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationErrors([]);
  };

  const handleSave = async (): Promise<void> => {
    if (!id || !patient) return;

    const validation = validatePatient({
      name: formData.name || "",
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      address: formData.address || undefined,
      notes: formData.notes || undefined
    });

    if (!validation.success) {
      setValidationErrors(validation.errors);
      return;
    }

    setSaving(true);
    try {
      const updated = await window.electronAPI.updatePatient(id ?? "", {
        name: validation.data.name,
        email: validation.data.email,
        phone: validation.data.phone,
        address: validation.data.address,
        notes: validation.data.notes
      });
      setPatient(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = (): void => {
    setFormData(patient || {});
    setIsEditing(false);
    setValidationErrors([]);
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingState />
      </PageContainer>
    );
  }

  if (error || !patient) {
    return (
      <PageContainer>
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
          Error: {error || "Paciente no encontrado"}
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.PATIENTS.LIST)}
          className="mt-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a la lista
        </Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: "Pacientes", href: `#${ROUTES.PATIENTS.LIST}` },
          { label: patient.name }
        ]}
      />

      <PageHeader
        title={isEditing ? "Editar Paciente" : patient.name}
        description={isEditing ? "Modifica los datos del paciente" : "Detalles del paciente"}
        action={
          isEditing
            ? undefined
            : {
                label: "Editar",
                onClick: () => setIsEditing(true)
              }
        }
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Información del Paciente</CardTitle>
            {isEditing ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-1" />
                  {saving ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4 mr-1" />
                Editar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre completo</label>
              {isEditing ? (
                <Input
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={validationErrors.some((e) => e.includes("nombre")) ? "border-destructive" : ""}
                />
              ) : (
                <p className="text-lg">{patient.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={validationErrors.some((e) => e.includes("email")) ? "border-destructive" : ""}
                  />
                ) : (
                  <p className="text-muted-foreground">{patient.email || "No especificado"}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Teléfono
                </label>
                {isEditing ? (
                  <Input
                    value={formData.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className={validationErrors.some((e) => e.includes("teléfono")) ? "border-destructive" : ""}
                  />
                ) : (
                  <p className="text-muted-foreground">{patient.phone || "No especificado"}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Dirección
              </label>
              {isEditing ? (
                <Input
                  value={formData.address || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className={validationErrors.some((e) => e.includes("dirección")) ? "border-destructive" : ""}
                />
              ) : (
                <p className="text-muted-foreground">{patient.address || "No especificada"}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notas</label>
              {isEditing ? (
                <Textarea
                  value={formData.notes || ""}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  rows={4}
                  className={validationErrors.some((e) => e.includes("notas")) ? "border-destructive" : ""}
                />
              ) : (
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {patient.notes || "Sin notas"}
                </p>
              )}
            </div>

            {validationErrors.length > 0 && (
              <div className="text-sm text-destructive space-y-1">
                {validationErrors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Creado: {new Date(patient.created_at).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Actualizado: {new Date(patient.updated_at).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        onClick={() => navigate(ROUTES.PATIENTS.LIST)}
        className="mt-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a la lista
      </Button>
    </PageContainer>
  );
};
