import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { PageHeader } from "@/shared/components/page-header";
import { PageContainer } from "@/shared/components/page-container";
import { EmptyState } from "@/shared/components/empty-state";
import { CardSkeleton } from "@/shared/components/loading-state";
import { ROUTES, BREADCRUMB_MAP } from "@/shared/lib/routes";
import { Calendar, Stethoscope, User, FileText } from "lucide-react";
import { consultationService } from "@/services";

interface ConsultationWithPatient {
  consultation: {
    id: string;
    patientId: string;
    date: string;
    reason: string;
    diagnosis: string;
    createdAt: string;
  };
  patient: {
    id: string;
    name: string;
  } | null;
}

export const ConsultationsList = (): ReactElement => {
  const [consultations, setConsultations] = useState<ConsultationWithPatient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    setLoading(true);
    try {
      const data = await consultationService.getAllWithPatients();
      setConsultations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar consultas");
    } finally {
      setLoading(false);
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
      <Breadcrumb items={BREADCRUMB_MAP[ROUTES.CONSULTATIONS.LIST]} />

      <PageHeader
        title="Consultas Médicas"
        description="Historial de consultas médicas"
        action={{
          label: "Nueva Consulta",
          href: `#${ROUTES.CONSULTATIONS.NEW}`
        }}
      />

      {loading && <CardSkeleton count={4} />}

      {error !== null && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
          Error: {error}
        </div>
      )}

      {!loading && error === null && consultations.length === 0 && (
        <EmptyState
          title="No hay consultas"
          description="No se han registrado consultas médicas aún"
          action={{
            label: "Registrar primera consulta",
            onClick: () => (window.location.hash = `#${ROUTES.CONSULTATIONS.NEW}`)
          }}
        />
      )}

      {!loading && error === null && consultations.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {consultations.map(({ consultation, patient }) => (
            <Card
              key={consultation.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() =>
                (window.location.hash = `#${ROUTES.CONSULTATIONS.DETAIL(consultation.id)}`)
              }
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatDate(consultation.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">
                      {patient?.name || "Paciente no encontrado"}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Stethoscope className="w-4 h-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Motivo:</p>
                      <p className="font-medium">{consultation.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Diagnóstico:</p>
                      <p className="font-medium">{consultation.diagnosis}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
};