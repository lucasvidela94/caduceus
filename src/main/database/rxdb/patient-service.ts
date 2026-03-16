import { getRxDatabase } from "./database";
import { v4 as uuidv4 } from "uuid";

function toPatientShape(doc: { id: string; name: string; email: string | null; phone: string | null; address: string | null; notes: string | null; reminderPreference: string; createdAt: number; updatedAt: number }) {
  return { id: doc.id, name: doc.name, email: doc.email, phone: doc.phone, address: doc.address, notes: doc.notes, reminderPreference: doc.reminderPreference, created_at: doc.createdAt, updated_at: doc.updatedAt };
}

export const patientService = {
  async getAll() {
    const db = await getRxDatabase();
    const docs = await db.patients.find().exec();
    return docs.map(d => toPatientShape(d as any));
  },

  async getById(id: string) {
    const db = await getRxDatabase();
    const doc = await db.patients.findOne(id).exec();
    if (!doc) throw new Error("Patient not found");
    return toPatientShape(doc as any);
  },

  async create(data: {
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    notes?: string | null;
    reminderPreference?: string;
  }) {
    const db = await getRxDatabase();
    const now = Date.now();
    const created = await db.patients.insert({
      id: uuidv4(),
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address || null,
      notes: data.notes || null,
      reminderPreference: data.reminderPreference || "email",
      createdAt: now,
      updatedAt: now,
    });
    return toPatientShape(created as any);
  },

  async update(id: string, data: Partial<{
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    notes?: string | null;
    reminderPreference?: string;
  }>) {
    const db = await getRxDatabase();
    const patient = await db.patients.findOne(id).exec();
    if (!patient) throw new Error("Patient not found");
    
    await patient.update({
      $set: {
        ...data,
        updatedAt: Date.now(),
      },
    });
    const updated = await db.patients.findOne(id).exec();
    return updated ? toPatientShape(updated as any) : null;
  },

  async delete(id: string) {
    const db = await getRxDatabase();
    const patient = await db.patients.findOne(id).exec();
    if (!patient) throw new Error("Patient not found");
    await patient.remove();
  },

  async search(query: string) {
    const db = await getRxDatabase();
    const regex = new RegExp(query, "i");
    const docs = await db.patients.find({
      selector: {
        $or: [
          { name: { $regex: regex } },
          { email: { $regex: regex } },
          { phone: { $regex: regex } },
          { address: { $regex: regex } },
        ],
      },
    }).exec();
    return docs.map(d => toPatientShape(d as any));
  },
};