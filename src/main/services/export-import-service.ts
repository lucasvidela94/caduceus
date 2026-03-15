import * as fs from "fs";
import * as path from "path";
import { PatientRepository } from "../database/repositories/patient-repository";
import { getConnection } from "../database/connection";
import type { Patient } from "../../shared/types";

export interface ExportData {
  version: string;
  exportedAt: string;
  patients: Patient[];
}

export const exportToJSON = (filePath: string): void => {
  const patients = PatientRepository.findAll();

  const exportData: ExportData = {
    version: "0.2.0",
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
        PatientRepository.create({
          name: patient.name,
          email: patient.email || undefined,
          phone: patient.phone || undefined,
          address: patient.address || undefined,
          notes: patient.notes || undefined
        });
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

  const header = "id,name,email,phone,address,notes,created_at,updated_at";
  const rows = patients.map((p) => {
    const escapeCsv = (str: string | null) => {
      if (!str) return "";
      return `"${str.replace(/"/g, '""')}"`;
    };
    return `${p.id},${escapeCsv(p.name)},${escapeCsv(p.email)},${escapeCsv(p.phone)},${escapeCsv(p.address)},${escapeCsv(p.notes)},${p.created_at},${p.updated_at}`;
  });

  const csv = [header, ...rows].join("\n");
  fs.writeFileSync(filePath, csv, "utf8");
};

export const checkIntegrity = (): { ok: boolean; errors: string[] } => {
  const errors: string[] = [];

  try {
    const db = getConnection();
    const sqlite = db.$client as { prepare: (sql: string) => { all: () => unknown[]; get: () => unknown } };

    const patientCount = sqlite.prepare("SELECT COUNT(*) as count FROM patients").get() as { count: number };
    if (!patientCount || typeof patientCount.count !== "number") {
      errors.push("Invalid patient count result");
    }

    const tables = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as Array<{ name: string }>;
    const requiredTables = ["patients"];
    const existingTables = tables.map((t) => t.name);

    for (const required of requiredTables) {
      if (!existingTables.includes(required)) {
        errors.push(`Missing required table: ${required}`);
      }
    }

    const invalidPatients = sqlite.prepare("SELECT COUNT(*) as count FROM patients WHERE name IS NULL OR name = ''").get() as { count: number };
    if (invalidPatients.count > 0) {
      errors.push(`Found ${invalidPatients.count} patients with invalid names`);
    }

    sqlite.prepare("PRAGMA integrity_check").all();
  } catch (error) {
    errors.push(`Integrity check failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }

  return {
    ok: errors.length === 0,
    errors
  };
};