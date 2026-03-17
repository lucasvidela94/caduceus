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
- **Multi-Instance Ready** - Supports multiple PCs per clinic
- **Future-Proof** - RxDB architecture ready for cloud sync

---

## Features

### Patient Management
- Create, view, edit and delete patient records
- Advanced patient search (name, email, phone, address)
- Patient contact preferences (email, SMS, both, none)
- Persistent local storage with RxDB (JSON-based)
- Offline-first architecture
- Data export (JSON, CSV)
- Automatic data persistence

### Appointment Scheduling
- Full appointment calendar with daily/weekly views
- Time slot availability checking
- Appointment duration configuration (15, 30, 45, 60 min)
- Working hours configuration (9:00 - 18:00 default)
- Appointment status tracking (pending, completed, cancelled, no-show)

### Medical Consultations
- Complete medical history per patient
- Consultation records with:
  - Vital signs (blood pressure, heart rate, temperature)
  - Physical measurements (weight, height)
  - Physical exam notes
  - Diagnosis and treatment
  - Prescriptions
  - Requested studies (lab, X-ray, ECG, ultrasound)
- Next appointment scheduling

### Automated Reminders
- Email and SMS appointment reminders
- Automatic reminder scheduling (24 hours before)
- Patient preference-based reminder delivery
- Reminder status tracking (pending, sent, failed)

### Clinic Configuration
- Clinic information (name, address, phone, email)
- Doctor profile (name, license number, specialty)
- Working hours configuration
- Default appointment duration
- Settings persisted in database

### Security & Backups
- Automatic daily backups
- Manual backup creation
- Backup retention policy
- Database integrity verification
- Restore from backup
- Encryption service ready for sensitive data

### Dashboard & Analytics
- Overview statistics (total patients, consultations, appointments)
- Monthly activity tracking
- Today's appointments list
- Recent consultations
- Quick navigation to all features

### Modern UI/UX
- Clean, professional medical interface
- Organized sidebar with dropdown menus
- Responsive design
- Keyboard shortcuts
- Built with shadcn/ui components
- Breadcrumb navigation

### Technical Excellence
- TypeScript throughout
- Feature-based architecture
- Repository pattern + Service layer
- Zod validation
- Drizzle ORM for database
- Unit tests with Vitest

---

## Tech Stack

<div align="center">

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Desktop | Electron 35 |
| Database | RxDB (JSON persistence) |
| Storage | JSON files with auto-sync |
| Validation | Zod |
| Testing | Vitest |
| Build | Vite |

</div>

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/lucasvidela94/caduceus.git
cd caduceus

# Install dependencies
pnpm install

# Rebuild native modules for Electron
pnpm rebuild:electron
```

### Development

```bash
# Run in development mode
pnpm dev
```

### Build for Production

```bash
# Build the application
pnpm build

# Run the production build
pnpm start
```

### Database

The application uses **RxDB** with JSON file persistence:

- Data is stored in the user's data directory (`~/.config/Caduceus/rxdb-data/` on Linux, `%APPDATA%/Caduceus/rxdb-data/` on Windows)
- Auto-saved every 5 seconds
- Human-readable JSON format for easy backup/inspection
- No migrations needed - RxDB handles schema versions automatically

### Run Tests

```bash
pnpm test        # Run unit tests
pnpm test:ui     # Run tests with UI
pnpm test:coverage  # Run tests with coverage
```

---

## Project Structure

```
caduceus/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── storage.ts           # RxStorage exposer (JSON persistence)
│   │   ├── ipc/                 # IPC handlers
│   │   │   └── handlers/        # Feature handlers
│   │   ├── services/            # Business logic (backup, export)
│   │   └── window/              # Window & menu management
│   ├── preload/                 # Preload scripts (secure bridge)
│   └── renderer/                # React frontend
│       ├── database/            # RxDB database & schemas
│       ├── services/            # RxDB services (patients, appointments, etc.)
│       ├── features/            # Feature modules
│       │   ├── dashboard/
│       │   ├── patients/
│       │   ├── appointments/
│       │   ├── consultations/
│       │   └── settings/
│       ├── shared/              # Shared components
│       │   ├── components/      # Reusable UI components
│       │   └── lib/             # Utilities (routes, validation)
│       └── components/          # shadcn/ui components
├── dist/                        # Build output
└── tests/                       # Test files
```

---

## Architecture

### Architecture Overview
Caduceus uses a **modern offline-first architecture** with RxDB:

### Backend (Main Process)
- **RxStorage**: JSON file persistence with auto-save
- **IPC Bridge**: Secure communication between processes
- **Services**: Backup, export/import functionality

### Frontend (Renderer Process)
- **RxDB**: Local database with reactive queries
- **Services**: Business logic (patients, appointments, consultations)
- **Feature-Based**: Each feature is self-contained
- **Hash Router**: Works with file:// protocol

### Database (RxDB)
- **Offline-First**: Works without internet
- **Reactive**: Real-time UI updates
- **JSON Persistence**: Human-readable, easy to backup
- **Multi-Instance**: Ready for multiple PCs per clinic
- **Future Sync**: Architecture ready for cloud synchronization
- **Type-Safe**: Full TypeScript support

---

## Roadmap

### Completed (v0.1.0)
- ✅ Patient management (CRUD)
- ✅ Appointment scheduling
- ✅ Medical consultations
- ✅ Automated reminders
- ✅ Clinic configuration
- ✅ Dashboard with analytics
- ✅ Advanced search
- ✅ Backup system

### v0.2.0 (Planned)
- Patient medical history timeline
- Document attachments (images, PDFs)
- Lab results tracking with charts
- Multi-user support
- Role-based access control

### v0.3.0 (Planned)
- Billing and invoicing
- Insurance management
- Prescription printing
- Report generation

### v1.0.0 (Planned)
- Offline-first sync architecture
- Cloud synchronization
- Mobile companion app
- API for integrations

---

## Data Storage & Security

Caduceus uses **RxDB** with **AES-256 encrypted** JSON persistence for secure medical data storage:

- **Storage Location**: User's application data directory
  - Linux: `~/.config/Caduceus/rxdb-data/`
  - Windows: `%APPDATA%/Caduceus/rxdb-data/`
  - macOS: `~/Library/Application Support/Caduceus/rxdb-data/`
- **Encryption**: AES-256-GCM (industry standard)
  - Database file encrypted at rest
  - Encryption key stored separately with restricted permissions
  - Authentication tag prevents tampering
- **Auto-Save**: Every 5 seconds
- **Backup**: Copy the `rxdb-data` folder (backup includes encrypted data)
- **Multi-Instance**: Supports multiple PCs per clinic
- **Sync-Ready**: Architecture prepared for future cloud synchronization

### Architecture

```
┌─────────────────┐     IPC      ┌──────────────────┐
│  Renderer       │ ◄──────────► │  Main Process    │
│  (RxDB)         │              │  (RxStorage)     │
│                 │              │                  │
│  - Services     │              │  - JSON files    │
│  - React UI     │              │  - Persistence   │
└─────────────────┘              └──────────────────┘
```

### Benefits

- ✅ **Encrypted at Rest** - AES-256 encryption for medical data
- ✅ **No Native Dependencies** - Pure JavaScript, no compilation issues
- ✅ **Offline-First** - Works without internet
- ✅ **Reactive** - Real-time UI updates
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **Future-Proof** - Ready for cloud sync
- ✅ **Multi-Platform** - Works on Windows, macOS, Linux

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
- [RxDB](https://rxdb.info/) - Offline-first database
- [RxDB Electron Plugin](https://rxdb.info/electron.html) - Electron integration

---

<p align="center">
  Made with ❤️ for better healthcare
</p>