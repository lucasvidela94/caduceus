import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { PageHeader } from "@/shared/components/page-header";
import { PageContainer } from "@/shared/components/page-container";
import { EmptyState } from "@/shared/components/empty-state";
import { CardSkeleton } from "@/shared/components/loading-state";
import { ROUTES, BREADCRUMB_MAP } from "@/shared/lib/routes";
import { Calendar, Clock, User, CalendarDays } from "lucide-react";
import { appointmentService } from "@/services";

interface Appointment {
  appointment: {
    id: string;
    patientId: string;
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
    id: string;
    name: string;
  } | null;
}

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  completed: "Completado",
  cancelled: "Cancelado",
  "no-show": "No asistió"
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  "no-show": "bg-gray-100 text-gray-800"
};

export const AppointmentsList = (): ReactElement => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    loadAppointments();
  }, [selectedDate]);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const data = await appointmentService.getByDateWithPatients(selectedDate);
      setAppointments(data);
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setIsLoading(false);
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

  return (
    <PageContainer>
      <Breadcrumb items={BREADCRUMB_MAP[ROUTES.APPOINTMENTS.LIST]} />

      <PageHeader
        title="Turnos"
        description="Gestiona los turnos médicos"
        action={{
          label: "Nuevo Turno",
          onClick: () => window.location.hash = `#${ROUTES.APPOINTMENTS.NEW}`
        }}
      />

      <div className="flex items-center gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Fecha
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded-md px-3 py-2"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => window.location.hash = `#${ROUTES.APPOINTMENTS.CALENDAR}`}
        >
          <CalendarDays className="w-4 h-4 mr-2" />
          Calendario
        </Button>
      </div>

      {isLoading && <CardSkeleton count={4} />}

      {!isLoading && appointments.length === 0 && (
        <EmptyState
          title="No hay turnos"
          description={`No hay turnos programados para ${formatDate(selectedDate)}`}
          action={{
            label: "Crear turno",
            onClick: () => window.location.hash = `#${ROUTES.APPOINTMENTS.NEW}`
          }}
        />
      )}

      {!isLoading && appointments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold capitalize">
            {formatDate(selectedDate)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map(({ appointment, patient }) => (
              <Card
                key={appointment.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => window.location.hash = `#${ROUTES.APPOINTMENTS.DETAIL(appointment.id)}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <CardTitle className="text-lg">
                        {appointment.time}
                      </CardTitle>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[appointment.status]}`}>
                      {statusLabels[appointment.status]}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {patient?.name || "Paciente no encontrado"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{appointment.reason}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Duración: {appointment.duration} minutos
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
};