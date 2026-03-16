import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import { useParams } from "@/shared/hooks/use-params";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { CardSkeleton } from "@/shared/components/loading-state";
import { ROUTES } from "@/shared/lib/routes";
import { Calendar, User, Stethoscope, FileText, ArrowLeft, Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AppointmentDetail {
  appointment: {
    id: number;
    patientId: number;
    date: string;
    time: string;
    duration: number;
    reason: string;
    status: "pending" | "completed" | "cancelled" | "no-show";
    notes: string | null;
    createdAt: string;
    updatedAt: string;
  };
  patient: {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
  } | null;
}

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  "no-show": "bg-gray-100 text-gray-800 border-gray-200"
};

const STATUS_LABELS = {
  pending: "Pendiente",
  completed: "Completado",
  cancelled: "Cancelado",
  "no-show": "No asistió"
};

export const AppointmentDetail = (): ReactElement => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadAppointment();
    }
  }, [id]);

  const loadAppointment = async () => {
    try {
      const data = await window.electronAPI.getAppointmentById(Number(id));
      if (data) {
        setAppointment(data);
      } else {
        setError("Turno no encontrado");
      }
    } catch (err) {
      setError("Error al cargar el turno");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await window.electronAPI.deleteAppointment(Number(id));
      window.location.hash = `#${ROUTES.APPOINTMENTS.LIST}`;
    } catch (err) {
      setError("Error al eliminar el turno");
    }
  };

  const handleStatusChange = async (status: string) => {
    try {
      await window.electronAPI.updateAppointment(Number(id), { status });
      loadAppointment();
    } catch (err) {
      setError("Error al actualizar el estado");
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <CardSkeleton count={1} />
      </PageContainer>
    );
  }

  if (error || !appointment) {
    return (
      <PageContainer>
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
          {error || "Turno no encontrado"}
        </div>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.hash = `#${ROUTES.APPOINTMENTS.LIST}`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a turnos
        </Button>
      </PageContainer>
    );
  }

  const { appointment: apt, patient } = appointment;

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: "Turnos", href: `#${ROUTES.APPOINTMENTS.LIST}` },
          { label: "Detalle" }
        ]}
      />

      <PageHeader
        title="Detalle del Turno"
        description={`Turno #${apt.id}`}
        action={{
          label: "Editar",
          onClick: () => window.location.hash = `#${ROUTES.APPOINTMENTS.EDIT(apt.id)}`
        }}
      />

      <div className="flex gap-2 mb-6">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar turno?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El turno será eliminado
                permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Información del Turno
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Estado:</span>
              <Select
                value={apt.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-[180px]">
                  <Badge className={STATUS_COLORS[apt.status]}>
                    {STATUS_LABELS[apt.status]}
                  </Badge>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Fecha:</span>
              <span className="font-medium capitalize">
                {formatDate(apt.date)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Hora:</span>
              <span className="font-medium">{apt.time}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Duración:</span>
              <span className="font-medium">{apt.duration} minutos</span>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-start gap-2">
                <Stethoscope className="w-4 h-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Motivo:</p>
                  <p className="font-medium">{apt.reason}</p>
                </div>
              </div>
            </div>

            {apt.notes && (
              <div className="pt-4 border-t">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Notas:</p>
                    <p className="font-medium">{apt.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Paciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patient ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre:</p>
                  <p className="font-medium text-lg">{patient.name}</p>
                </div>

                {patient.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email:</p>
                    <p className="font-medium">{patient.email}</p>
                  </div>
                )}

                {patient.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono:</p>
                    <p className="font-medium">{patient.phone}</p>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() =>
                    window.location.hash = `#${ROUTES.PATIENTS.DETAIL(patient.id)}`
                  }
                >
                  Ver ficha del paciente
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">Paciente no encontrado</p>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};