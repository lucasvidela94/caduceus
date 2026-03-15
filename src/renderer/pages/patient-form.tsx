import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { ReactElement } from "react";
import "./patient-form.css";

export const PatientForm = (): ReactElement => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (name.trim().length === 0) {
      setMessage({ type: "error", text: "El nombre es requerido" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const patient = await window.electronAPI.addPatient(name.trim());
      setMessage({
        type: "success",
        text: `Paciente ${patient.name} guardado con ID ${patient.id}`
      });
      setName("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error desconocido"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Nuevo Paciente</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">Nombre del Paciente</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingrese el nombre"
            className="form-input"
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Paciente"}
        </button>
      </form>

      {message !== null && (
        <div className={`form-message form-message--${message.type}`}>
          {message.text}
        </div>
      )}

      <button
        type="button"
        onClick={() => navigate("/patients")}
        className="btn btn--secondary form-back"
      >
        Volver a Pacientes
      </button>
    </div>
  );
};
