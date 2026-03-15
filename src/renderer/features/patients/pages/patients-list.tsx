import { useState, useEffect } from "react";
import type { Patient } from "@shared/types";
import type { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { PageHeader } from "@/shared/components/page-header";
import { PageContainer } from "@/shared/components/page-container";
import { EmptyState } from "@/shared/components/empty-state";
import { CardSkeleton } from "@/shared/components/loading-state";
import { ROUTES, BREADCRUMB_MAP } from "@/shared/lib/routes";

export const PatientsList = (): ReactElement => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.electronAPI
      .getPatients()
      .then((data: Patient[]) => {
        setPatients(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <PageContainer>
      <Breadcrumb items={BREADCRUMB_MAP[ROUTES.PATIENTS.LIST]} />

      <PageHeader
        title="Lista de Pacientes"
        description="Gestiona los pacientes registrados en el sistema"
        action={{
          label: "Nuevo Paciente",
          href: `#${ROUTES.PATIENTS.NEW}`
        }}
      />

      {loading && <CardSkeleton count={6} />}

      {error !== null && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
          Error: {error}
        </div>
      )}

      {!loading && error === null && patients.length === 0 && (
        <EmptyState
          title="No hay pacientes"
          description="Comienza agregando tu primer paciente al sistema"
          action={{
            label: "Crear primer paciente",
            onClick: () => window.location.hash = `#${ROUTES.PATIENTS.NEW}`
          }}
        />
      )}

      {!loading && error === null && patients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => (
            <Card key={patient.id}>
              <CardHeader>
                <CardTitle className="text-base">{patient.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  ID: {patient.id}
                </p>
                <p className="text-sm text-muted-foreground">
                  Registrado:{" "}
                  {new Date(patient.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
};
