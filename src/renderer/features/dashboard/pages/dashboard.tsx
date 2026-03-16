import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { ROUTES } from "@/shared/lib/routes";
import { 
  Users, 
  Calendar, 
  Stethoscope, 
  Activity,
  Clock,
  ArrowRight
} from "lucide-react";

interface DashboardStats {
  totalPatients: number;
  newPatientsThisMonth: number;
  totalConsultations: number;
  consultationsThisMonth: number;
  pendingAppointments: number;
  todayAppointments: number;
  recentConsultations: Array<{
    id: string;
    patientName: string;
    date: string;
    reason: string;
  }>;
  upcomingAppointments: Array<{
    id: string;
    patientName: string;
    time: string;
    reason: string;
  }>;
}

export const Dashboard = (): ReactElement => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [patients, consultations, appointments] = await Promise.all([
        window.electronAPI.getPatients(),
        window.electronAPI.getConsultations(),
        window.electronAPI.getAppointments()
      ]);

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const today = now.toISOString().split("T")[0];

      const newPatientsThisMonth = patients.filter(p => {
        const createdDate = new Date(p.created_at);
        return createdDate >= firstDayOfMonth;
      }).length;

      const consultationsThisMonth = consultations.filter(c => {
        const consultDate = new Date(c.consultation.date);
        return consultDate >= firstDayOfMonth;
      }).length;

      const pendingAppointments = appointments.filter(a => 
        a.appointment.status === "pending"
      ).length;

      const todayAppointments = appointments.filter(a => {
        const aptDate = new Date(a.appointment.date);
        return aptDate.toISOString().split("T")[0] === today;
      });

      const recentConsultations = consultations
        .sort((a, b) => new Date(b.consultation.date).getTime() - new Date(a.consultation.date).getTime())
        .slice(0, 5)
        .map(c => ({
          id: c.consultation.id,
          patientName: c.patient?.name || "Paciente desconocido",
          date: c.consultation.date,
          reason: c.consultation.reason
        }));

      const upcomingAppointments = todayAppointments
        .sort((a, b) => a.appointment.time.localeCompare(b.appointment.time))
        .map(a => ({
          id: a.appointment.id,
          patientName: a.patient?.name || "Paciente desconocido",
          time: a.appointment.time,
          reason: a.appointment.reason
        }));

      setStats({
        totalPatients: patients.length,
        newPatientsThisMonth,
        totalConsultations: consultations.length,
        consultationsThisMonth,
        pendingAppointments,
        todayAppointments: todayAppointments.length,
        recentConsultations,
        upcomingAppointments
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short"
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center py-8">Cargando dashboard...</div>
      </PageContainer>
    );
  }

  if (error || !stats) {
    return (
      <PageContainer>
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
          Error: {error || "No se pudieron cargar los datos"}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Resumen de la actividad del consultorio"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newPatientsThisMonth} este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConsultations}</div>
            <p className="text-xs text-muted-foreground">
              {stats.consultationsThisMonth} este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnos Pendientes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.todayAppointments} para hoy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actividad</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.consultationsThisMonth > 0 
                ? Math.round((stats.consultationsThisMonth / stats.totalPatients) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Pacientes atendidos este mes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Turnos de Hoy</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.hash = `#${ROUTES.APPOINTMENTS.LIST}`}
            >
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {stats.upcomingAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay turnos programados para hoy</p>
            ) : (
              <div className="space-y-3">
                {stats.upcomingAppointments.map((apt) => (
                  <div 
                    key={apt.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                    onClick={() => window.location.hash = `#${ROUTES.APPOINTMENTS.DETAIL(apt.id)}`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{apt.patientName}</p>
                        <p className="text-sm text-muted-foreground">{apt.reason}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{apt.time}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Últimas Consultas</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.hash = `#${ROUTES.CONSULTATIONS.LIST}`}
            >
              Ver todas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {stats.recentConsultations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay consultas registradas</p>
            ) : (
              <div className="space-y-3">
                {stats.recentConsultations.map((consult) => (
                  <div 
                    key={consult.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                    onClick={() => window.location.hash = `#${ROUTES.CONSULTATIONS.DETAIL(consult.id)}`}
                  >
                    <div>
                      <p className="font-medium">{consult.patientName}</p>
                      <p className="text-sm text-muted-foreground">{consult.reason}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(consult.date)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};