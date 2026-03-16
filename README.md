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
- **Ready for Cloud Sync** - Architecture prepared for future offline-first sync

---

## Features

### Patient Management
- Create, view, edit and delete patient records
- Advanced patient search (name, email, phone, address)
- Patient contact preferences (email, SMS, both, none)
- Persistent local storage with SQLite
- Data export (JSON, CSV)

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
| Database | SQLite (better-sqlite3) |
| ORM | Drizzle ORM |
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

### Database Operations

```bash
# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Push schema changes
pnpm db:push

# Open Drizzle Studio
pnpm db:studio
```

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
│   │   ├── database/            # SQLite connection & migrations
│   │   │   ├── repositories/    # Data access layer
│   │   │   └── schema/          # Database schemas
│   │   ├── ipc/                 # IPC handlers
│   │   │   └── handlers/        # Feature handlers
│   │   ├── services/            # Business logic
│   │   └── window/              # Window & menu management
│   ├── preload/                 # Preload scripts (secure bridge)
│   └── renderer/                # React frontend
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
├── drizzle/                     # Database migrations
├── dist/                        # Build output
└── tests/                       # Test files
```

---

## Architecture

### Backend (Main Process)
- **Repository Pattern**: Clean data access abstraction
- **Service Layer**: Business logic independent of UI
- **IPC Handlers**: Secure communication between processes
- **Schema-First**: Database schemas with Drizzle ORM

### Frontend (Renderer)
- **Feature-Based**: Each feature is self-contained
- **Shared Components**: Reusable UI components
- **Hash Router**: Works with file:// protocol
- **Hooks**: Custom hooks for data fetching

### Database
- **SQLite**: Local-first database
- **Migrations**: Version-controlled schema changes
- **Relations**: Proper foreign key relationships
- **Type-Safe**: Full TypeScript support with Drizzle

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

## Known Issues

### better-sqlite3 Module Version
Due to better-sqlite3 being a native module, you may encounter version conflicts between Node.js and Electron. If you see `ERR_DLOPEN_FAILED`:

```bash
# Rebuild for Electron
pnpm rebuild:electron

# Or force rebuild
rm -rf node_modules/better-sqlite3/build
npx electron-rebuild --version=35.0.2
```

### Future Solution
We plan to migrate to **RxDB** or **ElectricSQL** for true offline-first architecture with automatic sync, eliminating native module compilation issues.

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
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) - SQLite driver

---

<p align="center">
  Made with ❤️ for better healthcare
</p>