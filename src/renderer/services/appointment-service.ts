import { getRxDatabase } from "@/database/database";
import { v4 as uuidv4 } from "uuid";
import { patientService } from "./patient-service";

async function withPatients<T extends { patientId: string }>(list: T[]) {
  return Promise.all(
    list.map(async (apt) => {
      let patient: { id: string; name: string; email?: string | null; phone?: string | null } | null = null;
      try {
        const p = await patientService.getById(apt.patientId);
        patient = { id: p.id, name: p.name, email: p.email, phone: p.phone };
      } catch {
        patient = null;
      }
      return { appointment: apt, patient };
    })
  );
}

export const appointmentService = {
  async getAll() {
    const db = await getRxDatabase();
    return db.appointments.find().exec();
  },

  async getById(id: string) {
    const db = await getRxDatabase();
    return db.appointments.findOne(id).exec();
  },

  async getByPatientId(patientId: string) {
    const db = await getRxDatabase();
    return db.appointments.find({ selector: { patientId } }).exec();
  },

  async getByDate(date: string) {
    const db = await getRxDatabase();
    return db.appointments.find({ selector: { date } }).exec();
  },

  async getByDateRange(startDate: string, endDate: string) {
    const db = await getRxDatabase();
    return db.appointments.find({
      selector: { date: { $gte: startDate, $lte: endDate } },
    }).exec();
  },

  async create(data: {
    patientId: string;
    date: string;
    time: string;
    duration: number;
    reason: string;
    notes?: string | null;
  }) {
    const db = await getRxDatabase();
    const now = Date.now();
    return db.appointments.insert({
      id: uuidv4(),
      patientId: data.patientId,
      date: data.date,
      time: data.time,
      duration: data.duration || 30,
      reason: data.reason,
      status: "pending",
      notes: data.notes || null,
      created_at: now,
      updated_at: now,
    });
  },

  async update(id: string, data: Partial<{
    date: string;
    time: string;
    duration: number;
    reason: string;
    status: string;
    notes: string | null;
  }>) {
    const db = await getRxDatabase();
    const appointment = await db.appointments.findOne(id).exec();
    if (!appointment) throw new Error("Appointment not found");
    await appointment.update({
      $set: { ...data, updated_at: Date.now() },
    });
    return appointment;
  },

  async delete(id: string) {
    const db = await getRxDatabase();
    const appointment = await db.appointments.findOne(id).exec();
    if (!appointment) throw new Error("Appointment not found");
    await appointment.remove();
  },

  async getByDateWithPatients(date: string) {
    const list = await appointmentService.getByDate(date);
    return withPatients(list);
  },

  async getByDateRangeWithPatients(startDate: string, endDate: string) {
    const list = await appointmentService.getByDateRange(startDate, endDate);
    return withPatients(list);
  },

  async getAllWithPatients() {
    const list = await appointmentService.getAll();
    return withPatients(list);
  },

  async getByIdWithPatient(id: string) {
    const apt = await appointmentService.getById(id);
    if (!apt) return null;
    const arr = await withPatients([apt]);
    return arr[0] ?? null;
  },

  async getAvailableSlots(date: string, duration: number = 30) {
    const db = await getRxDatabase();
    const appointments = await db.appointments.find({ selector: { date } }).exec();
    const slots: string[] = [];
    const startHour = 9;
    const endHour = 18;
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const slotStart = hour * 60 + minute;
        const slotEnd = slotStart + duration;
        const isOverlapping = appointments.some(apt => {
          const [aptHours, aptMinutes] = apt.time.split(":").map(Number);
          const aptStart = aptHours * 60 + aptMinutes;
          const aptEnd = aptStart + apt.duration;
          return slotStart < aptEnd && slotEnd > aptStart;
        });
        if (!isOverlapping) slots.push(time);
      }
    }
    return slots;
  },
};
