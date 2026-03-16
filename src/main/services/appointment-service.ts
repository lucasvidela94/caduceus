import { appointmentRepository } from "../database/repositories/appointment-repository";
import { NewAppointment } from "../database/schema/appointments";

const CLINIC_HOURS = {
  start: 9,
  end: 18,
};

const VALID_STATUSES = ["pending", "completed", "cancelled", "no-show"] as const;

export const appointmentService = {
  getAll: async () => {
    return appointmentRepository.findAll();
  },

  getById: async (id: number) => {
    return appointmentRepository.findById(id);
  },

  getByPatientId: async (patientId: number) => {
    return appointmentRepository.findByPatientId(patientId);
  },

  getByDate: async (date: Date) => {
    return appointmentRepository.findByDate(date);
  },

  getByDateRange: async (startDate: Date, endDate: Date) => {
    return appointmentRepository.findByDateRange(startDate, endDate);
  },

  create: async (data: NewAppointment) => {
    validateAppointment(data);
    
    const [hours, minutes] = data.time.split(":").map(Number);
    if (hours < CLINIC_HOURS.start || hours >= CLINIC_HOURS.end) {
      throw new Error(`Appointments must be between ${CLINIC_HOURS.start}:00 and ${CLINIC_HOURS.end}:00`);
    }

    const overlapping = await appointmentRepository.findOverlapping(
      data.date,
      data.time,
      data.duration || 30
    );
    
    if (overlapping.length > 0) {
      throw new Error("This time slot is already booked");
    }

    return appointmentRepository.create(data);
  },

  update: async (id: number, data: Partial<NewAppointment>) => {
    const existing = await appointmentRepository.findById(id);
    if (!existing) {
      throw new Error("Appointment not found");
    }

    if (data.time || data.date || data.duration) {
      const date = data.date || existing.appointment.date;
      const time = data.time || existing.appointment.time;
      const duration = data.duration || existing.appointment.duration;

      if (data.time) {
        const [hours, minutes] = time.split(":").map(Number);
        if (hours < CLINIC_HOURS.start || hours >= CLINIC_HOURS.end) {
          throw new Error(`Appointments must be between ${CLINIC_HOURS.start}:00 and ${CLINIC_HOURS.end}:00`);
        }
      }

      const overlapping = await appointmentRepository.findOverlapping(
        date,
        time,
        duration,
        id
      );
      
      if (overlapping.length > 0) {
        throw new Error("This time slot is already booked");
      }
    }

    if (data.status && !VALID_STATUSES.includes(data.status as typeof VALID_STATUSES[number])) {
      throw new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`);
    }

    return appointmentRepository.update(id, data);
  },

  delete: async (id: number) => {
    const existing = await appointmentRepository.findById(id);
    if (!existing) {
      throw new Error("Appointment not found");
    }
    return appointmentRepository.delete(id);
  },

  getAvailableSlots: async (date: Date, duration: number = 30) => {
    const slots: string[] = [];
    const appointments = await appointmentRepository.findByDate(date);
    
    for (let hour = CLINIC_HOURS.start; hour < CLINIC_HOURS.end; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const [aptHours, aptMinutes] = time.split(":").map(Number);
        const startMinutes = aptHours * 60 + aptMinutes;
        const endMinutes = startMinutes + duration;
        
        const isOverlapping = appointments.some(apt => {
          const [existingHours, existingMinutes] = apt.appointment.time.split(":").map(Number);
          const existingStart = existingHours * 60 + existingMinutes;
          const existingEnd = existingStart + apt.appointment.duration;
          return (startMinutes < existingEnd && endMinutes > existingStart);
        });
        
        if (!isOverlapping) {
          slots.push(time);
        }
      }
    }
    
    return slots;
  },
};

function validateAppointment(data: NewAppointment) {
  if (!data.patientId) {
    throw new Error("Patient is required");
  }
  
  if (!data.date) {
    throw new Error("Date is required");
  }
  
  if (!data.time) {
    throw new Error("Time is required");
  }
  
  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.time)) {
    throw new Error("Invalid time format. Use HH:MM");
  }
  
  if (!data.reason) {
    throw new Error("Reason is required");
  }
}