import * as fs from "fs";
import * as path from "path";
import { PatientRepository } from "../database/repositories/patient-repository";
import { getConnection } from "../database/connection";

export interface ExportData {
  version: string;
  exportedAt: string;
  patients: Array<{
    id: number;
    name: string;
    created_at: string;
  }>;
}

export const exportToJSON = (filePath: string): void => {
  const patients = PatientRepository.findAll();

  const exportData: ExportData = {
    version: "0.1.0",
    exportedAt: new Date().toISOString(),
    patients
  };

  fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2), "utf8");
};

export const importFromJSON = (filePath: string): { imported: number; errors: string[] } => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(content) as ExportData;

  if (!data.patients || !Array.isArray(data.patients)) {
    throw new Error("Invalid export file format");
  }

  const errors: string[] = [];
  let imported = 0;

  for (const patient of data.patients) {
    try {
      if (patient.name && typeof patient.name === "string") {
        PatientRepository.create({ name: patient.name });
        imported++;
      }
    } catch (error) {
      errors.push(`Failed to import patient: ${patient.name || "unknown"}`);
    }
  }

  return { imported, errors };
};

export const exportToCSV = (filePath: string): void => {
  const patients = PatientRepository.findAll();

  const header = "id,name,created_at";
  const rows = patients.map((p) => `${p.id},"${p.name.replace(/"/g, '""')}","${p.created_at}"`);

  const csv = [header, ...rows].join("\n");
  fs.writeFileSync(filePath, csv, "utf8");
};

export const checkIntegrity = (): { ok: boolean; errors: string[] } => {
  const errors: string[] = [];

  try {
    const db = getConnection();

    const patientCount = db.prepare("SELECT COUNT(*) as count FROM patients").get() as { count: number };
    if (!patientCount || typeof patientCount.count !== "number") {
      errors.push("Invalid patient count result");
    }

    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as Array<{ name: string }>;
    const requiredTables = ["patients", "sqlite_sequence"];
    const existingTables = tables.map((t) => t.name);

    for (const required of requiredTables) {
      if (!existingTables.includes(required)) {
        errors.push(`Missing required table: ${required}`);
      }
    }

    const invalidPatients = db.prepare("SELECT COUNT(*) as count FROM patients WHERE name IS NULL OR name = ''").get() as { count: number };
    if (invalidPatients.count > 0) {
      errors.push(`Found ${invalidPatients.count} patients with invalid names`);
    }

    db.prepare("PRAGMA integrity_check").all();
  } catch (error) {
    errors.push(`Integrity check failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }

  return {
    ok: errors.length === 0,
    errors
  };
};
