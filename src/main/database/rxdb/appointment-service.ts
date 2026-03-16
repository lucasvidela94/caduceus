import { getRxDatabase } from "./database";
import { v4 as uuidv4 } from "uuid";

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
    return db.appointments.find({
      selector: { patientId },
    }).exec();
  },

  async getByDate(date: string) {
    const db = await getRxDatabase();
    return db.appointments.find({
      selector: { date },
    }).exec();
  },

  async getByDateRange(startDate: string, endDate: string) {
    const db = await getRxDatabase();
    return db.appointments.find({
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
      $set: {
        ...data,
        updated_at: Date.now(),
      },
    });
    return appointment;
  },

  async delete(id: string) {
    const db = await getRxDatabase();
    const appointment = await db.appointments.findOne(id).exec();
    if (!appointment) throw new Error("Appointment not found");
    await appointment.remove();
  },

  async findOverlapping(date: string, time: string, duration: number, excludeId?: string) {
    const db = await getRxDatabase();
    const appointments = await db.appointments.find({
      selector: { date },
    }).exec();

    const [hours, minutes] = time.split(":").map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;

    return appointments.filter(apt => {
      if (excludeId && apt.id === excludeId) return false;
      
      const [aptHours, aptMinutes] = apt.time.split(":").map(Number);
      const aptStart = aptHours * 60 + aptMinutes;
      const aptEnd = aptStart + apt.duration;
      
      return (startMinutes < aptEnd && endMinutes > aptStart);
    });
  },

  async getAvailableSlots(date: string, duration: number = 30) {
    const db = await getRxDatabase();
    const appointments = await db.appointments.find({
      selector: { date },
    }).exec();

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
          return (slotStart < aptEnd && slotEnd > aptStart);
        });

        if (!isOverlapping) {
          slots.push(time);
        }
      }
    }

    return slots;
  },
};