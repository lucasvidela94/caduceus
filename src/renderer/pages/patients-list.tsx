import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Patient } from "@shared/types";
import type { ReactElement } from "react";
import "./patients-list.css";

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
    <div className="patients-container">
      <div className="patients-header">
        <h1 className="patients-title">Lista de Pacientes</h1>
        <Link to="/patients/new" className="btn btn--success">Nuevo Paciente</Link>
      </div>

      {loading && <p>Cargando pacientes...</p>}

      {error !== null && (
        <div className="patients-error">Error: {error}</div>
      )}

      {!loading && error === null && patients.length === 0 && (
        <p>No hay pacientes registrados</p>
      )}

      {!loading && error === null && patients.length > 0 && (
        <div className="patients-grid">
          {patients.map((patient) => (
            <div key={patient.id} className="patient-card">
              <h3 className="patient-card__name">{patient.name}</h3>
              <p className="patient-card__meta">ID: {patient.id}</p>
              <p className="patient-card__meta">
                Registrado:{" "}
                {new Date(patient.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
