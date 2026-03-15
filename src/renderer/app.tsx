import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout";
import { Dashboard } from "./pages/dashboard";
import { PatientsList } from "./pages/patients-list";
import { PatientForm } from "./pages/patient-form";

import type { ReactElement } from "react";

export const App = (): ReactElement => {
  return (
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
  );
};
