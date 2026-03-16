import * as fs from "fs";
import * as path from "path";
import { patientService } from "../database/rxdb";
import type { Patient } from "../../shared/types";

export interface ExportData {
  version: string;
  exportedAt: string;
  patients: Patient[];
}

export const exportToJSON = async (filePath: string): Promise<void> => {
  const patients = await patientService.getAll();

  const exportData: ExportData = {
    version: "0.3.0",
    exportedAt: new Date().toISOString(),
    patients
  };

  fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2), "utf8");
};

export const importFromJSON = async (filePath: string): Promise<{ imported: number; errors: string[] }> => {
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
        await patientService.create({
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

export const exportToCSV = async (filePath: string): Promise<void> => {
  const patients = await patientService.getAll();

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

export const checkIntegrity = async (): Promise<{ ok: boolean; errors: string[] }> => {
  const errors: string[] = [];

  try {
    const patients = await patientService.getAll();
    
    // Check for patients with invalid names
    const invalidPatients = patients.filter(p => !p.name || p.name.trim() === "");
    if (invalidPatients.length > 0) {
      errors.push(`Found ${invalidPatients.length} patients with invalid names`);
    }

    // Check for duplicate IDs
    const ids = patients.map(p => p.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      errors.push("Found duplicate patient IDs");
    }

  } catch (error) {
    errors.push(`Integrity check failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }

  return {
    ok: errors.length === 0,
    errors
  };
};