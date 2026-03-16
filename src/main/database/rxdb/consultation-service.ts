import { getRxDatabase } from "./database";
import { v4 as uuidv4 } from "uuid";

export const consultationService = {
  async getAll() {
    const db = await getRxDatabase();
    return db.consultations.find().exec();
  },

  async getById(id: string) {
    const db = await getRxDatabase();
    return db.consultations.findOne(id).exec();
  },

  async getByPatientId(patientId: string) {
    const db = await getRxDatabase();
    return db.consultations.find({
      selector: { patientId },
    }).exec();
  },

  async getByDateRange(startDate: string, endDate: string) {
    const db = await getRxDatabase();
    return db.consultations.find({
      selector: {
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    }).exec();
  },

  async create(data: {
    patientId: string;
    date: string;
    reason: string;
    symptoms?: string | null;
    bloodPressure?: string | null;
    heartRate?: number | null;
    temperature?: string | null;
    weight?: string | null;
    height?: string | null;
    physicalExam?: string | null;
    diagnosis: string;
    treatment?: string | null;
    prescription?: string | null;
    labRequested?: boolean;
    rxRequested?: boolean;
    ecgRequested?: boolean;
    ultrasoundRequested?: boolean;
    otherStudies?: string | null;
    nextAppointment?: string | null;
    notes?: string | null;
  }) {
    const db = await getRxDatabase();
    const now = Date.now();
    return db.consultations.insert({
      id: uuidv4(),
      patientId: data.patientId,
      date: data.date,
      reason: data.reason,
      symptoms: data.symptoms || null,
      bloodPressure: data.bloodPressure || null,
      heartRate: data.heartRate || null,
      temperature: data.temperature || null,
      weight: data.weight || null,
      height: data.height || null,
      physicalExam: data.physicalExam || null,
      diagnosis: data.diagnosis,
      treatment: data.treatment || null,
      prescription: data.prescription || null,
      labRequested: data.labRequested || false,
      rxRequested: data.rxRequested || false,
      ecgRequested: data.ecgRequested || false,
      ultrasoundRequested: data.ultrasoundRequested || false,
      otherStudies: data.otherStudies || null,
      nextAppointment: data.nextAppointment || null,
      notes: data.notes || null,
      createdAt: now,
      updatedAt: now,
    });
  },

  async update(id: string, data: Partial<{
    date: string;
    reason: string;
    symptoms: string | null;
    bloodPressure: string | null;
    heartRate: number | null;
    temperature: string | null;
    weight: string | null;
    height: string | null;
    physicalExam: string | null;
    diagnosis: string;
    treatment: string | null;
    prescription: string | null;
    labRequested: boolean;
    rxRequested: boolean;
    ecgRequested: boolean;
    ultrasoundRequested: boolean;
    otherStudies: string | null;
    nextAppointment: string | null;
    notes: string | null;
  }>) {
    const db = await getRxDatabase();
    const consultation = await db.consultations.findOne(id).exec();
    if (!consultation) throw new Error("Consultation not found");
    
    await consultation.update({
      $set: {
        ...data,
        updatedAt: Date.now(),
      },
    });
    return consultation;
  },

  async delete(id: string) {
    const db = await getRxDatabase();
    const consultation = await db.consultations.findOne(id).exec();
    if (!consultation) throw new Error("Consultation not found");
    await consultation.remove();
  },
};