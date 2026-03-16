import { useState, useEffect } from "react";
import type { Patient } from "@shared/types";
import type { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Breadcrumb } from "@/shared/components/breadcrumb";
import { PageHeader } from "@/shared/components/page-header";
import { PageContainer } from "@/shared/components/page-container";
import { EmptyState } from "@/shared/components/empty-state";
import { CardSkeleton } from "@/shared/components/loading-state";
import { ROUTES, BREADCRUMB_MAP } from "@/shared/lib/routes";
import { Mail, Phone, MapPin } from "lucide-react";

export const PatientsList = (): ReactElement => {
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPatients = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let data: Patient[];
        if (searchQuery.trim()) {
          data = await window.electronAPI.searchPatients(searchQuery);
        } else {
          data = await window.electronAPI.getPatients();
        }
        setFilteredPatients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar pacientes");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(loadPatients, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

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

      <div className="max-w-md">
        <Input
          type="text"
          placeholder="Buscar pacientes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {loading && <CardSkeleton count={6} />}

      {error !== null && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
          Error: {error}
        </div>
      )}

      {!loading && error === null && filteredPatients.length === 0 && (
        <EmptyState
          title={searchQuery ? "No se encontraron pacientes" : "No hay pacientes"}
          description={
            searchQuery
              ? "Intenta con otra búsqueda"
              : "Comienza agregando tu primer paciente al sistema"
          }
          action={
            !searchQuery
              ? {
                  label: "Crear primer paciente",
                  onClick: () => (window.location.hash = `#${ROUTES.PATIENTS.NEW}`)
                }
              : undefined
          }
        />
      )}

      {!loading && error === null && filteredPatients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <Card
              key={patient.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => window.location.hash = `#${ROUTES.PATIENTS.DETAIL(patient.id)}`}
            >
              <CardHeader>
                <CardTitle className="text-base">{patient.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {patient.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                )}
                {patient.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{patient.phone}</span>
                  </div>
                )}
                {patient.address && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{patient.address}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Registrado: {new Date(patient.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
};
