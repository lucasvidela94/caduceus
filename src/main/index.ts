import { app, BrowserWindow, Menu } from "electron";
import * as path from "path";
import { registerIpcHandlers } from "./ipc-handlers";
import { setupMenu } from "./window-manager";

const PLATFORM = {
  DARWIN: "darwin"
} as const;

const createWindow = (): BrowserWindow => {
  console.log("Creating window...");
  
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.once("ready-to-show", () => {
    console.log("Window ready to show");
    win.show();
  });

  win.webContents.on("did-fail-load", (_, errorCode, errorDescription) => {
    console.error("Failed to load:", errorCode, errorDescription);
  });

  win.webContents.on("dom-ready", () => {
    console.log("DOM ready");
  });

  const isDev = process.env.NODE_ENV === "development";
  const htmlPath = path.join(__dirname, "../../dist/renderer/index.html");
  console.log("Loading HTML from:", htmlPath);

  if (isDev) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(htmlPath);
  }

  return win;
};

app.whenReady().then(() => {
  console.log("App ready");
  registerIpcHandlers();
  setupMenu();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== PLATFORM.DARWIN) {
    app.quit();
  }
});
