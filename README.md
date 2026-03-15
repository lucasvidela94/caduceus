<p align="center">
  <img src="https://raw.githubusercontent.com/lucasvidela94/caduceus/refs/heads/master/src/renderer/assets/images/logo.png" alt="Caduceus" width="128" height="128"/>
</p>

<h1 align="center">Caduceus</h1>

<p align="center">
  <strong>Modern desktop application for medical practice management</strong>
</p>

<p align="center">
  <a href="https://github.com/lucasvidela94/caduceus/releases">
    <img src="https://img.shields.io/github/v/release/lucasvidela94/caduceus?include_prereleases&label=version&color=blue" alt="Version"/>
  </a>
  <a href="https://github.com/lucasvidela94/caduceus/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/lucasvidela94/caduceus?color=green" alt="License"/>
  </a>
  <a href="https://github.com/lucasvidela94/caduceus/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/lucasvidela94/caduceus/test?label=tests" alt="Tests"/>
  </a>
  <a href="https://github.com/lucasvidela94/caduceus">
    <img src="https://img.shields.io/github/stars/lucasvidela94/caduceus" alt="Stars"/>
  </a>
</p>

---

## About

Caduceus is a **local-first**, privacy-focused desktop application for medical practice management. Built with modern web technologies and packaged as a native desktop application, it keeps all patient data securely on your machine.

### Why Caduceus?

- **100% Local** - Your data never leaves your computer
- **Offline-First** - Works without internet
- **Privacy-Focused** - No cloud, no subscriptions, no vendor lock-in
- **Open Source** - Transparent, auditable code

---

## Features

### Patient Management
- Create, view, and manage patient records
- Persistent local storage with SQLite
- Data export (JSON, CSV)

### Security & Backups
- Automatic daily backups
- Backup retention policy (30 days, max 10 files)
- Database integrity verification
- Encryption service ready for sensitive data

### Modern UI/UX
- Clean, professional medical interface
- Responsive sidebar navigation
- Keyboard shortcuts
- Built with shadcn/ui components

### Technical Excellence
- TypeScript throughout
- Feature-based architecture
- Repository pattern + Service layer
- Zod validation
- Unit tests with Vitest

---

## Tech Stack

<div align="center">

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Desktop | Electron |
| Database | SQLite (better-sqlite3) |
| Validation | Zod |
| Testing | Vitest |
| Build | Vite |

</div>

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Quick Start

```bash
# Clone the repository
git clone https://github.com/lucasvidela94/caduceus.git
cd caduceus
```

### Build for Production

```bash
# Build the application
pnpm build

# Run the production build
pnpm start
```

### Run Tests

```bash
pnpm test        # Run unit tests
pnpm test:ui    # Run tests with UI
```

---

## Project Structure

```
caduceus/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── database/           # SQLite connection & migrations
│   │   │   └── repositories/  # Data access layer
│   │   ├── ipc/               # IPC handlers
│   │   │   └── handlers/      # Feature handlers
│   │   ├── services/          # Business logic
│   │   └── window/            # Window & menu management
│   ├── preload/               # Preload scripts (secure bridge)
│   └── renderer/               # React frontend
│       ├── features/           # Feature modules
│       │   ├── dashboard/
│       │   └── patients/
│       ├── shared/             # Shared components
│       │   ├── components/     # Reusable UI components
│       │   └── lib/           # Utilities (routes, validation)
│       └── components/          # shadcn/ui components
├── dist/                       # Build output
└── tests/                      # Test files
```

---

## Architecture

### Backend (Main Process)
- **Repository Pattern**: Clean data access abstraction
- **Service Layer**: Business logic independent of UI
- **IPC Handlers**: Secure communication between processes

### Frontend (Renderer)
- **Feature-Based**: Each feature is self-contained
- **Shared Components**: Reusable UI components
- **Hash Router**: Works with file:// protocol

---

## Roadmap

### v0.2.0
- Patient medical history
- Appointment scheduling
- Basic reporting

### v0.3.0
- Patient contact information
- Notes and observations
- Enhanced data fields

### v1.0.0
- Complete medical records
- Multi-user support
- Print templates

---

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Electron](https://www.electronjs.org/) - Desktop framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling system
- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool

---

<p align="center">
  Made with ❤️ for better healthcare
</p>
