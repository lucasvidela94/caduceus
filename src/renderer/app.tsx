import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { Dashboard } from "@/features/dashboard/pages/dashboard";
import { PatientsList } from "@/features/patients/pages/patients-list";
import { PatientForm } from "@/features/patients/pages/patient-form";
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </ErrorBoundary>
  );
};
