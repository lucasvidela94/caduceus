import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Patient } from "@shared/types";
import type { ReactElement } from "react";
import "./dashboard.css";

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
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="dashboard-stats">
        <p>Bienvenido al sistema de gestion de pacientes</p>
        <p>
          Total de pacientes:{" "}
          {error !== null ? (
            <span className="dashboard-error">Error: {error}</span>
          ) : patientCount === null ? (
            "Cargando..."
          ) : (
            patientCount
          )}
        </p>
      </div>
      <div className="dashboard-actions">
        <Link to="/patients" className="btn">Ver Pacientes</Link>
        <Link to="/patients/new" className="btn btn--primary">Nuevo Paciente</Link>
      </div>
    </div>
  );
};
