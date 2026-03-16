import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { Dashboard } from "@/features/dashboard/pages/dashboard";
import { PatientsList } from "@/features/patients/pages/patients-list";
import { PatientForm } from "@/features/patients/pages/patient-form";
import { PatientDetail } from "@/features/patients/pages/patient-detail";
import { AppointmentsList } from "@/features/appointments/pages/appointments-list";
import { AppointmentForm } from "@/features/appointments/pages/appointment-form";
import { AppointmentDetail } from "@/features/appointments/pages/appointment-detail";
import { ConsultationsList } from "@/features/consultations/pages/consultations-list";
import { ConsultationForm } from "@/features/consultations/pages/consultation-form";
import { SettingsPage } from "@/features/settings/pages/settings-page";
import { ErrorBoundary } from "@/shared/components/error-boundary";

import type { ReactElement } from "react";

export const App = (): ReactElement => {
  return (
    <ErrorBoundary>
      <TooltipProvider delayDuration={0}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="patients" element={<PatientsList />} />
              <Route path="patients/new" element={<PatientForm />} />
              <Route path="patients/:id" element={<PatientDetail />} />
              <Route path="appointments" element={<AppointmentsList />} />
              <Route path="appointments/new" element={<AppointmentForm />} />
              <Route path="appointments/:id" element={<AppointmentDetail />} />
              <Route path="consultations" element={<ConsultationsList />} />
              <Route path="consultations/new" element={<ConsultationForm />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </ErrorBoundary>
  );
};
