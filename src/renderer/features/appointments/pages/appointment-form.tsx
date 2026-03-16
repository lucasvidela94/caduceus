import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { PageHeader } from "@/shared/components/page-header";
import { PageContainer } from "@/shared/components/page-container";
import { ROUTES, BREADCRUMB_MAP } from "@/shared/lib/routes";
import { Calendar, Clock, User, Stethoscope, Bell } from "lucide-react";
import { patientService, appointmentService } from "@/services";
import { Checkbox } from "@/components/ui/checkbox";

interface Patient {
  id: string;
  name: string;
}

interface AppointmentFormData {
  patientId: string;
  date: string;
  time: string;
  duration: number;
  reason: string;
  notes: string;
  sendReminder: boolean;
}

const DURATION_OPTIONS = [
  { value: 15, label: "15 minutos" },
  { value: 30, label: "30 minutos" },
  { value: 45, label: "45 minutos" },
  { value: 60, label: "1 hora" }
];

export const AppointmentForm = (): ReactElement => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<AppointmentFormData>({
    patientId: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    duration: 30,
    reason: "",
    notes: "",
    sendReminder: true
  });

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (formData.date && formData.duration) {
      loadAvailableSlots();
    }
  }, [formData.date, formData.duration]);

  const loadPatients = async () => {
    try {
      const data = await patientService.getAll();
      setPatients(data);
    } catch (err) {
      setError("Error al cargar pacientes");
    } finally {
      setLoadingPatients(false);
    }
  };

  const loadAvailableSlots = async () => {
    try {
      const slots = await appointmentService.getAvailableSlots(formData.date, formData.duration);
      setAvailableSlots(slots);
      if (slots.length > 0 && !formData.time) {
        setFormData(prev => ({ ...prev, time: slots[0] }));
      }
    } catch (err) {
      console.error("Error loading slots:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await appointmentService.create({
        patientId: formData.patientId,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        reason: formData.reason,
        notes: formData.notes || undefined
      });
      window.location.hash = `#${ROUTES.APPOINTMENTS.LIST}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear turno");
      setLoading(false);
    }
  };

  if (loadingPatients) {
    return (
      <PageContainer>
        <div className="flex justify-center py-8">Cargando...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Breadcrumb items={BREADCRUMB_MAP[ROUTES.APPOINTMENTS.NEW]} />

      <PageHeader
        title="Nuevo Turno"
        description="Programa un nuevo turno médico"
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Datos del Turno
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-destructive/10 text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="patient">
                <User className="w-4 h-4 inline mr-1" />
                Paciente *
              </Label>
              <Select
                value={formData.patientId}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, patientId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Fecha *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, date: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Duración *
                </Label>
                <Select
                  value={formData.duration.toString()}
                  onValueChange={(value) =>
                    setFormData(prev => ({ ...prev, duration: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value.toString()}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">
                <Clock className="w-4 h-4 inline mr-1" />
                Horario disponible *
              </Label>
              {availableSlots.length === 0 ? (
                <p className="text-sm text-muted-foreground text-red-500">
                  No hay horarios disponibles para esta fecha y duración
                </p>
              ) : (
                <Select
                  value={formData.time}
                  onValueChange={(value) =>
                    setFormData(prev => ({ ...prev, time: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar horario" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">
                <Stethoscope className="w-4 h-4 inline mr-1" />
                Motivo de consulta *
              </Label>
              <Input
                id="reason"
                value={formData.reason}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, reason: e.target.value }))
                }
                placeholder="Ej: Consulta general, Control, etc."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas adicionales</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Información adicional sobre el turno..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2 p-4 border rounded-lg bg-muted/50">
              <Checkbox
                id="sendReminder"
                checked={formData.sendReminder}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, sendReminder: checked as boolean }))
                }
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="sendReminder"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  Enviar recordatorio al paciente
                </Label>
                <p className="text-sm text-muted-foreground">
                  Se enviará un recordatorio 24 horas antes del turno
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.location.hash = `#${ROUTES.APPOINTMENTS.LIST}`}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.patientId || !formData.time}
              >
                {loading ? "Guardando..." : "Crear Turno"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
};