import { Menu, MenuItemConstructorOptions, BrowserWindow } from "electron";

export const setupMenu = (): void => {
  const template: MenuItemConstructorOptions[] = [
    {
      label: "Archivo",
      submenu: [
        {
          label: "Dashboard",
          accelerator: "CmdOrCtrl+D",
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            if (win !== null) {
              win.webContents.executeJavaScript(`
                window.location.hash = "/";
              `);
            }
          }
        },
        {
          label: "Lista de Pacientes",
          accelerator: "CmdOrCtrl+L",
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            if (win !== null) {
              win.webContents.executeJavaScript(`
                window.location.hash = "/patients";
              `);
            }
          }
        },
        {
          label: "Nuevo Paciente",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            if (win !== null) {
              win.webContents.executeJavaScript(`
                window.location.hash = "/patients/new";
              `);
            }
          }
        },
        { type: "separator" },
        {
          label: "Cerrar",
          accelerator: "CmdOrCtrl+W",
          role: "close"
        }
      ]
    },
    {
      label: "Ver",
      submenu: [
        {
          label: "Recargar",
          accelerator: "CmdOrCtrl+R",
          click: (_, focusedWindow) => {
            if (focusedWindow instanceof BrowserWindow) {
              focusedWindow.reload();
            }
          }
        },
        {
          label: "Herramientas de Desarrollo",
          accelerator: process.platform === "darwin" ? "Alt+Cmd+I" : "Ctrl+Shift+I",
          click: (_, focusedWindow) => {
            if (focusedWindow instanceof BrowserWindow) {
              focusedWindow.webContents.toggleDevTools();
            }
          }
        },
        { type: "separator" },
        {
          label: "Pantalla Completa",
          accelerator: process.platform === "darwin" ? "Ctrl+Cmd+F" : "F11",
          click: (_, focusedWindow) => {
            if (focusedWindow instanceof BrowserWindow) {
              const isFullScreen = focusedWindow.isFullScreen();
              focusedWindow.setFullScreen(!isFullScreen);
            }
          }
        }
      ]
    },
    {
      label: "Ventana",
      submenu: [
        {
          label: "Minimizar",
          accelerator: "CmdOrCtrl+M",
          role: "minimize"
        },
        {
          label: "Cerrar",
          accelerator: "CmdOrCtrl+W",
          role: "close"
        }
      ]
    },
    {
      label: "Ayuda",
      submenu: [
        {
          label: "Acerca de Medicos Desktop",
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            if (win !== null) {
              win.webContents.executeJavaScript(`
                alert("Medicos Desktop v0.1.0\\n\\nApp para gestion medica");
              `);
            }
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
