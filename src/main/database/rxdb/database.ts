import { createRxDatabase, addRxPlugin, RxDatabase } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";

// Add plugins
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);

// Database instance
let db: RxDatabase | null = null;

// Patient schema
const patientSchema = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    name: {
      type: "string",
    },
    email: {
      type: ["string", "null"],
    },
    phone: {
      type: ["string", "null"],
    },
    address: {
      type: ["string", "null"],
    },
    notes: {
      type: ["string", "null"],
    },
    reminderPreference: {
      type: "string",
      default: "email",
    },
    createdAt: {
      type: "number",
    },
    updatedAt: {
      type: "number",
    },
  },
  required: ["id", "name", "createdAt", "updatedAt"],
};

// Appointment schema
const appointmentSchema = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    patientId: {
      type: "string",
      ref: "patients",
    },
    date: {
      type: "string", // ISO date string
    },
    time: {
      type: "string",
    },
    duration: {
      type: "number",
      default: 30,
    },
    reason: {
      type: "string",
    },
    status: {
      type: "string",
      enum: ["pending", "completed", "cancelled", "no-show"],
      default: "pending",
    },
    notes: {
      type: ["string", "null"],
    },
    createdAt: {
      type: "number",
    },
    updatedAt: {
      type: "number",
    },
  },
  required: ["id", "patientId", "date", "time", "reason", "createdAt", "updatedAt"],
};

// Consultation schema
const consultationSchema = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    patientId: {
      type: "string",
      ref: "patients",
    },
    date: {
      type: "string",
    },
    reason: {
      type: "string",
    },
    symptoms: {
      type: ["string", "null"],
    },
    bloodPressure: {
      type: ["string", "null"],
    },
    heartRate: {
      type: ["number", "null"],
    },
    temperature: {
      type: ["string", "null"],
    },
    weight: {
      type: ["string", "null"],
    },
    height: {
      type: ["string", "null"],
    },
    physicalExam: {
      type: ["string", "null"],
    },
    diagnosis: {
      type: "string",
    },
    treatment: {
      type: ["string", "null"],
    },
    prescription: {
      type: ["string", "null"],
    },
    labRequested: {
      type: "boolean",
      default: false,
    },
    rxRequested: {
      type: "boolean",
      default: false,
    },
    ecgRequested: {
      type: "boolean",
      default: false,
    },
    ultrasoundRequested: {
      type: "boolean",
      default: false,
    },
    otherStudies: {
      type: ["string", "null"],
    },
    nextAppointment: {
      type: ["string", "null"],
    },
    notes: {
      type: ["string", "null"],
    },
    createdAt: {
      type: "number",
    },
    updatedAt: {
      type: "number",
    },
  },
  required: ["id", "patientId", "date", "reason", "diagnosis", "createdAt", "updatedAt"],
};

// Settings schema
const settingsSchema = {
  version: 0,
  primaryKey: "key",
  type: "object",
  properties: {
    key: {
      type: "string",
      maxLength: 100,
    },
    value: {
      type: "string",
    },
    updatedAt: {
      type: "number",
    },
  },
  required: ["key", "value", "updatedAt"],
};

export const getRxDatabase = async (): Promise<RxDatabase> => {
  if (db) return db;

  db = await createRxDatabase({
    name: "caduceus",
    storage: getRxStorageDexie(),
    ignoreDuplicate: true,
  });

  // Create collections
  await db.addCollections({
    patients: {
      schema: patientSchema,
    },
    appointments: {
      schema: appointmentSchema,
    },
    consultations: {
      schema: consultationSchema,
    },
    settings: {
      schema: settingsSchema,
    },
  });

  console.log("RxDB initialized");
  return db;
};

export const closeRxDatabase = async (): Promise<void> => {
  if (db) {
    await (db as any).destroy();
    db = null;
  }
};

export type CaduceusDatabase = Awaited<ReturnType<typeof getRxDatabase>>;