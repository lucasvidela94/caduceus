import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Calendar, Stethoscope, User, Activity, FileText, FlaskConical } from "lucide-react";

interface Patient {
  id: string;
  name: string;
}

interface ConsultationFormData {
  patientId: string;
  date: string;
  reason: string;
  symptoms: string;
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  weight: string;
  height: string;
  physicalExam: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  labRequested: boolean;
  rxRequested: boolean;
  ecgRequested: boolean;
  ultrasoundRequested: boolean;
  otherStudies: string;
  nextAppointment: string;
  notes: string;
}

export const ConsultationForm = (): ReactElement => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ConsultationFormData>({
    patientId: "",
    date: new Date().toISOString().split("T")[0],
    reason: "",
    symptoms: "",
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    weight: "",
    height: "",
    physicalExam: "",
    diagnosis: "",
    treatment: "",
    prescription: "",
    labRequested: false,
    rxRequested: false,
    ecgRequested: false,
    ultrasoundRequested: false,
    otherStudies: "",
    nextAppointment: "",
    notes: ""
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await window.electronAPI.getPatients();
      setPatients(data);
    } catch (err) {
      setError("Error al cargar pacientes");
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await window.electronAPI.createConsultation({
        patientId: formData.patientId,
        date: formData.date,
        reason: formData.reason,
        symptoms: formData.symptoms || undefined,
        bloodPressure: formData.bloodPressure || undefined,
        heartRate: formData.heartRate ? parseInt(formData.heartRate) : undefined,
        temperature: formData.temperature || undefined,
        weight: formData.weight || undefined,
        height: formData.height || undefined,
        physicalExam: formData.physicalExam || undefined,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment || undefined,
        prescription: formData.prescription || undefined,
        labRequested: formData.labRequested,
        rxRequested: formData.rxRequested,
        ecgRequested: formData.ecgRequested,
        ultrasoundRequested: formData.ultrasoundRequested,
        otherStudies: formData.otherStudies || undefined,
        nextAppointment: formData.nextAppointment || undefined,
        notes: formData.notes || undefined
      });
      window.location.hash = `#${ROUTES.CONSULTATIONS.LIST}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear consulta");
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
      <Breadcrumb items={BREADCRUMB_MAP[ROUTES.CONSULTATIONS.NEW]} />

      <PageHeader
        title="Nueva Consulta Médica"
        description="Registra una nueva consulta médica"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Paciente y Fecha
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Paciente *</Label>
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

            <div className="space-y-2">
              <Label htmlFor="date">Fecha *</Label>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5" />
              Motivo y Síntomas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo de consulta *</Label>
              <Input
                id="reason"
                value={formData.reason}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, reason: e.target.value }))
                }
                placeholder="Ej: Dolor de cabeza, control anual..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="symptoms">Síntomas</Label>
              <Textarea
                id="symptoms"
                value={formData.symptoms}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, symptoms: e.target.value }))
                }
                placeholder="Describa los síntomas del paciente..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Examen Físico
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodPressure">Presión Arterial</Label>
              <Input
                id="bloodPressure"
                value={formData.bloodPressure}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, bloodPressure: e.target.value }))
                }
                placeholder="120/80"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heartRate">Frec. Cardíaca</Label>
              <Input
                id="heartRate"
                type="number"
                value={formData.heartRate}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, heartRate: e.target.value }))
                }
                placeholder="72"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperatura (°C)</Label>
              <Input
                id="temperature"
                value={formData.temperature}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, temperature: e.target.value }))
                }
                placeholder="37.0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                value={formData.weight}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, weight: e.target.value }))
                }
                placeholder="70.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                value={formData.height}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, height: e.target.value }))
                }
                placeholder="170"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="physicalExam">Examen Físico</Label>
              <Textarea
                id="physicalExam"
                value={formData.physicalExam}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, physicalExam: e.target.value }))
                }
                placeholder="Hallazgos del examen físico..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Diagnóstico y Tratamiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnóstico *</Label>
              <Textarea
                id="diagnosis"
                value={formData.diagnosis}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, diagnosis: e.target.value }))
                }
                placeholder="Diagnóstico médico..."
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatment">Tratamiento</Label>
              <Textarea
                id="treatment"
                value={formData.treatment}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, treatment: e.target.value }))
                }
                placeholder="Indicaciones terapéuticas..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prescription">Receta</Label>
              <Textarea
                id="prescription"
                value={formData.prescription}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, prescription: e.target.value }))
                }
                placeholder="Medicamentos recetados..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5" />
              Estudios Solicitados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="labRequested"
                  checked={formData.labRequested}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, labRequested: checked as boolean }))
                  }
                />
                <Label htmlFor="labRequested" className="cursor-pointer">
                  Laboratorio
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rxRequested"
                  checked={formData.rxRequested}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, rxRequested: checked as boolean }))
                  }
                />
                <Label htmlFor="rxRequested" className="cursor-pointer">
                  Rayos X
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ecgRequested"
                  checked={formData.ecgRequested}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, ecgRequested: checked as boolean }))
                  }
                />
                <Label htmlFor="ecgRequested" className="cursor-pointer">
                  ECG
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ultrasoundRequested"
                  checked={formData.ultrasoundRequested}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, ultrasoundRequested: checked as boolean }))
                  }
                />
                <Label htmlFor="ultrasoundRequested" className="cursor-pointer">
                  Ecografía
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherStudies">Otros estudios</Label>
              <Input
                id="otherStudies"
                value={formData.otherStudies}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, otherStudies: e.target.value }))
                }
                placeholder="Especifique otros estudios solicitados..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Seguimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nextAppointment">Próximo control</Label>
              <Input
                id="nextAppointment"
                type="date"
                value={formData.nextAppointment}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, nextAppointment: e.target.value }))
                }
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
                placeholder="Observaciones adicionales..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.location.hash = `#${ROUTES.CONSULTATIONS.LIST}`}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading || !formData.patientId || !formData.reason || !formData.diagnosis}
          >
            {loading ? "Guardando..." : "Guardar Consulta"}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};