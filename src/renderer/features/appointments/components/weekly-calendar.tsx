import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, Clock, User } from "lucide-react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { ROUTES } from "@/shared/lib/routes";

interface Appointment {
  id: string;
  patientId: string;
  date: string;
  time: string;
  duration: number;
  reason: string;
  status: "pending" | "completed" | "cancelled" | "no-show";
  notes: string | null;
  patient?: {
    id: string;
    name: string;
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

export function WeeklyCalendar() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  useEffect(() => {
    loadAppointments();
  }, [currentWeek]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const startDate = weekStart.toISOString().split("T")[0];
      const endDate = addDays(weekStart, 6).toISOString().split("T")[0];
      const data = await window.electronAPI.getAppointmentsByDateRange(startDate, endDate);
      setAppointments(data.map(item => ({
        ...item.appointment,
        patient: item.patient
      })));
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return isSameDay(aptDate, date);
    }).sort((a, b) => a.time.localeCompare(b.time));
  };

  const previousWeek = () => setCurrentWeek(addDays(currentWeek, -7));
  const nextWeek = () => setCurrentWeek(addDays(currentWeek, 7));
  const goToToday = () => setCurrentWeek(new Date());

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Calendario de Turnos
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={previousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hoy
          </Button>
          <Button variant="outline" size="sm" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-center">
          <p className="text-lg font-medium">
            {format(weekStart, "dd MMMM", { locale: es })} - {" "}
            {format(addDays(weekStart, 6), "dd MMMM yyyy", { locale: es })}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => {
              const dayAppointments = getAppointmentsForDay(day);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={index}
                  className={`border rounded-lg p-2 min-h-[200px] ${
                    isToday ? "bg-blue-50 border-blue-200" : "bg-white"
                  }`}
                >
                  <div className="text-center mb-2 pb-2 border-b">
                    <p className="text-sm font-medium capitalize">
                      {format(day, "EEEE", { locale: es })}
                    </p>
                    <p className={`text-lg font-bold ${isToday ? "text-blue-600" : ""}`}>
                      {format(day, "dd")}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {dayAppointments.map((apt) => (
                      <a
                        key={apt.id}
                        href={`#${ROUTES.APPOINTMENTS.DETAIL(apt.id)}`}
                        className="block"
                      >
                        <div className="p-2 rounded border hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-1 text-sm font-medium">
                            <Clock className="h-3 w-3" />
                            {apt.time}
                          </div>
                          {apt.patient && (
                            <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                              <User className="h-3 w-3" />
                              <span className="truncate">{apt.patient.name}</span>
                            </div>
                          )}
                          <Badge 
                            variant="outline" 
                            className={`text-xs mt-1 ${STATUS_COLORS[apt.status]}`}
                          >
                            {STATUS_LABELS[apt.status]}
                          </Badge>
                        </div>
                      </a>
                    ))}
                    {dayAppointments.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-4">
                        Sin turnos
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}