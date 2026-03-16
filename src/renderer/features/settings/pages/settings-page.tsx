import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { PageHeader } from "@/shared/components/page-header";
import { PageContainer } from "@/shared/components/page-container";
import { ROUTES, BREADCRUMB_MAP } from "@/shared/lib/routes";
import { Building2, User, Clock, Save } from "lucide-react";

interface SettingsData {
  clinic_name: string;
  doctor_name: string;
  doctor_license: string;
  doctor_specialty: string;
  clinic_address: string;
  clinic_phone: string;
  clinic_email: string;
  working_hours_start: string;
  working_hours_end: string;
  appointment_duration: string;
}

const defaultSettings: SettingsData = {
  clinic_name: "",
  doctor_name: "",
  doctor_license: "",
  doctor_specialty: "",
  clinic_address: "",
  clinic_phone: "",
  clinic_email: "",
  working_hours_start: "09:00",
  working_hours_end: "18:00",
  appointment_duration: "30"
};

export const SettingsPage = (): ReactElement => {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await window.electronAPI.getSettings();
      setSettings({ ...defaultSettings, ...data });
    } catch (err) {
      setError("Error al cargar configuración");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await window.electronAPI.updateMultipleSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof SettingsData, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center py-8">Cargando configuración...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Breadcrumb items={BREADCRUMB_MAP[ROUTES.SETTINGS]} />

      <PageHeader
        title="Configuración"
        description="Configura los datos del consultorio y del médico"
      />

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-destructive/10 text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 rounded-lg bg-green-100 text-green-800">
          Configuración guardada correctamente
        </div>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Datos del Consultorio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clinic_name">Nombre del Consultorio</Label>
              <Input
                id="clinic_name"
                value={settings.clinic_name}
                onChange={(e) => updateField("clinic_name", e.target.value)}
                placeholder="Ej: Consultorio Dr. García"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinic_address">Dirección</Label>
              <Textarea
                id="clinic_address"
                value={settings.clinic_address}
                onChange={(e) => updateField("clinic_address", e.target.value)}
                placeholder="Dirección completa del consultorio"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clinic_phone">Teléfono</Label>
                <Input
                  id="clinic_phone"
                  value={settings.clinic_phone}
                  onChange={(e) => updateField("clinic_phone", e.target.value)}
                  placeholder="Ej: 11 1234-5678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinic_email">Email</Label>
                <Input
                  id="clinic_email"
                  type="email"
                  value={settings.clinic_email}
                  onChange={(e) => updateField("clinic_email", e.target.value)}
                  placeholder="Ej: consultorio@email.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Datos del Médico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctor_name">Nombre completo *</Label>
                <Input
                  id="doctor_name"
                  value={settings.doctor_name}
                  onChange={(e) => updateField("doctor_name", e.target.value)}
                  placeholder="Ej: Dr. Juan García"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor_license">Número de Matrícula *</Label>
                <Input
                  id="doctor_license"
                  value={settings.doctor_license}
                  onChange={(e) => updateField("doctor_license", e.target.value)}
                  placeholder="Ej: MP 12345"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor_specialty">Especialidad</Label>
              <Input
                id="doctor_specialty"
                value={settings.doctor_specialty}
                onChange={(e) => updateField("doctor_specialty", e.target.value)}
                placeholder="Ej: Medicina General"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Horarios de Atención
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="working_hours_start">Hora de inicio</Label>
                <Input
                  id="working_hours_start"
                  type="time"
                  value={settings.working_hours_start}
                  onChange={(e) => updateField("working_hours_start", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="working_hours_end">Hora de fin</Label>
                <Input
                  id="working_hours_end"
                  type="time"
                  value={settings.working_hours_end}
                  onChange={(e) => updateField("working_hours_end", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointment_duration">Duración del turno (min)</Label>
                <Input
                  id="appointment_duration"
                  type="number"
                  min="15"
                  max="120"
                  step="15"
                  value={settings.appointment_duration}
                  onChange={(e) => updateField("appointment_duration", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full md:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Guardando..." : "Guardar Configuración"}
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};