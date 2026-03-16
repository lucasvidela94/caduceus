import { ipcMain } from "electron";
import { reminderService } from "../../services/reminder-service";
import { REMINDER_CHANNELS } from "../../../shared/channels";

export const registerReminderHandlers = (): void => {
  ipcMain.handle(REMINDER_CHANNELS.CREATE_REMINDERS_FOR_APPOINTMENT, async (_, appointmentId: string) => {
    return reminderService.createRemindersForAppointment(appointmentId);
  });

  ipcMain.handle(REMINDER_CHANNELS.GET_REMINDERS_BY_APPOINTMENT, async (_, appointmentId: string) => {
    return reminderService.getRemindersByAppointment(appointmentId);
  });

  ipcMain.handle(REMINDER_CHANNELS.CANCEL_REMINDERS, async (_, appointmentId: string) => {
    return reminderService.cancelReminders(appointmentId);
  });

  ipcMain.handle(REMINDER_CHANNELS.GET_REMINDER_STATS, async () => {
    return reminderService.getStats();
  });

  ipcMain.handle(REMINDER_CHANNELS.PROCESS_PENDING_REMINDERS, async () => {
    return reminderService.processPendingReminders();
  });
};