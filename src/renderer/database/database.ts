import { createRxDatabase, addRxPlugin, type RxDatabase } from "rxdb";
import { getRxStorageIpcRenderer } from "rxdb/plugins/electron";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";

addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);

const STORAGE_KEY = "main-storage";

const patientSchema = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: { type: "string", maxLength: 100 },
    name: { type: "string" },
    email: { type: ["string", "null"] },
    phone: { type: ["string", "null"] },
    address: { type: ["string", "null"] },
    notes: { type: ["string", "null"] },
    reminderPreference: { type: ["string", "null"] },
    created_at: { type: "number" },
    updated_at: { type: "number" },
  },
  required: ["id", "name", "created_at", "updated_at"],
};

const appointmentSchema = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: { type: "string", maxLength: 100 },
    patientId: { type: "string", ref: "patients" },
    date: { type: "string" },
    time: { type: "string" },
    duration: { type: "number", default: 30 },
    reason: { type: "string" },
    status: { type: "string", enum: ["pending", "completed", "cancelled", "no-show"], default: "pending" },
    notes: { type: ["string", "null"] },
    created_at: { type: "number" },
    updated_at: { type: "number" },
  },
  required: ["id", "patientId", "date", "time", "reason", "created_at", "updated_at"],
};

const consultationSchema = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: { type: "string", maxLength: 100 },
    patientId: { type: "string", ref: "patients" },
    date: { type: "string" },
    reason: { type: "string" },
    symptoms: { type: ["string", "null"] },
    bloodPressure: { type: ["string", "null"] },
    heartRate: { type: ["number", "null"] },
    temperature: { type: ["string", "null"] },
    weight: { type: ["string", "null"] },
    height: { type: ["string", "null"] },
    physicalExam: { type: ["string", "null"] },
    diagnosis: { type: "string" },
    treatment: { type: ["string", "null"] },
    prescription: { type: ["string", "null"] },
    labRequested: { type: "boolean", default: false },
    rxRequested: { type: "boolean", default: false },
    ecgRequested: { type: "boolean", default: false },
    ultrasoundRequested: { type: "boolean", default: false },
    otherStudies: { type: ["string", "null"] },
    nextAppointment: { type: ["string", "null"] },
    notes: { type: ["string", "null"] },
    created_at: { type: "number" },
    updated_at: { type: "number" },
  },
  required: ["id", "patientId", "date", "reason", "diagnosis", "created_at", "updated_at"],
};

const settingsSchema = {
  version: 0,
  primaryKey: "key",
  type: "object",
  properties: {
    key: { type: "string", maxLength: 100 },
    value: { type: "string" },
    updatedAt: { type: "number" },
  },
  required: ["key", "value", "updatedAt"],
};

let db: RxDatabase | null = null;
let initPromise: Promise<RxDatabase> | null = null;

export const getRxDatabase = async (): Promise<RxDatabase> => {
  if (db) return db;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    const ipcRenderer = window.electronAPI?.ipcRenderer;
    if (!ipcRenderer) throw new Error("ipcRenderer not available");
    const storage = getRxStorageIpcRenderer({
      key: STORAGE_KEY,
      ipcRenderer: ipcRenderer as any,
      mode: "storage",
    });
    const database = await createRxDatabase({
      name: "caduceus",
      storage,
    });
    await database.addCollections({
      patients: { schema: patientSchema },
      appointments: { schema: appointmentSchema },
      consultations: { schema: consultationSchema },
      settings: { schema: settingsSchema },
    });
    db = database;
    return database;
  })();
  return initPromise;
};

export const closeRxDatabase = async (): Promise<void> => {
  if (db) {
    await (db as any).destroy();
    db = null;
    initPromise = null;
  }
};

export type CaduceusDatabase = Awaited<ReturnType<typeof getRxDatabase>>;
