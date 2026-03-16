import { getRxDatabase } from "./database";
import { v4 as uuidv4 } from "uuid";

export const patientService = {
  async getAll() {
    const db = await getRxDatabase();
    return db.patients.find().exec();
  },

  async getById(id: string) {
    const db = await getRxDatabase();
    return db.patients.findOne(id).exec();
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
    return db.patients.insert({
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
    return patient;
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
    return db.patients.find({
      selector: {
        $or: [
          { name: { $regex: regex } },
          { email: { $regex: regex } },
          { phone: { $regex: regex } },
          { address: { $regex: regex } },
        ],
      },
    }).exec();
  },
};