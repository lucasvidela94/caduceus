import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Patient } from "@shared/types";
import type { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { PageHeader } from "@/shared/components/page-header";
import { PageContainer } from "@/shared/components/page-container";
import { ROUTES, BREADCRUMB_MAP } from "@/shared/lib/routes";

export const Dashboard = (): ReactElement => {
  const [patientCount, setPatientCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.electronAPI
      .getPatients()
      .then((patients: Patient[]) => {
        setPatientCount(patients.length);
      })
      .catch((err: Error) => {
        setError(err.message);
      });
  }, []);

  return (
    <PageContainer>
      <Breadcrumb items={BREADCRUMB_MAP[ROUTES.HOME]} />

      <PageHeader
        title="Dashboard"
        description="Bienvenido al sistema de gestión de pacientes"
        action={{
          label: "Nuevo Paciente",
          href: `#${ROUTES.PATIENTS.NEW}`
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-muted-foreground">
            Total de pacientes registrados en el sistema
          </p>
          <div className="text-3xl font-bold">
            {error !== null ? (
              <span className="text-destructive text-base">Error: {error}</span>
            ) : patientCount === null ? (
              "Cargando..."
            ) : (
              patientCount
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link to={ROUTES.PATIENTS.LIST}>Ver Pacientes</Link>
        </Button>
        <Button asChild>
          <Link to={ROUTES.PATIENTS.NEW}>Nuevo Paciente</Link>
        </Button>
      </div>
    </PageContainer>
  );
};
