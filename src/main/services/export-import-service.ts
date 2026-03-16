import * as fs from "fs";

export interface ExportData {
  version: string;
  exportedAt: string;
  patients: unknown[];
}

export const writeJsonExport = (filePath: string, data: ExportData): void => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

export const writeCsvExport = (filePath: string, csvContent: string): void => {
  fs.writeFileSync(filePath, csvContent, "utf8");
};

export const readFileContent = (filePath: string): string => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf8");
};
