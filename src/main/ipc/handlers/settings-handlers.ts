import { ipcMain } from "electron";
import { settingsService } from "../../database/rxdb";
import { SETTING_CHANNELS } from "../../../shared/channels";

export const registerSettingsHandlers = (): void => {
  ipcMain.handle(SETTING_CHANNELS.GET_ALL, async () => {
    return settingsService.getAll();
  });

  ipcMain.handle(SETTING_CHANNELS.GET_BY_KEY, async (_, key: string) => {
    return settingsService.getByKey(key);
  });

  ipcMain.handle(SETTING_CHANNELS.SET_VALUE, async (_, key: string, value: string) => {
    return settingsService.setValue(key, value);
  });

  ipcMain.handle(SETTING_CHANNELS.UPDATE_MULTIPLE, async (_, values: Record<string, string>) => {
    return settingsService.updateMultiple(values);
  });

  ipcMain.handle(SETTING_CHANNELS.GET_PRESCRIPTION_CONFIG, async () => {
    return settingsService.getPrescriptionConfig();
  });

  ipcMain.handle(SETTING_CHANNELS.GET_WORKING_HOURS, async () => {
    return settingsService.getWorkingHours();
  });
};