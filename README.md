# Caduceus

Modern desktop application for medical practice management built with Electron, React, and TypeScript.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Overview

Caduceus provides a clean, professional interface for managing patient records with a focus on simplicity and data integrity. Built with modern web technologies and packaged as a native desktop application.

## Features

### Current (v0.1.0)

- **Patient Management**
  - Create and store patient records
  - View patient list with search
  - Persistent local storage via SQLite
  
- **Modern UI/UX**
  - Clean, medical-grade interface
  - Responsive sidebar navigation
  - Dark/Light theme support
  - Keyboard shortcuts

- **Technical Stack**
  - TypeScript throughout
  - Feature-based architecture
  - Component library (shadcn/ui)
  - Form validation (Zod)
  - Unit tests (Vitest)

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Desktop**: Electron
- **Database**: SQLite (better-sqlite3)
- **Validation**: Zod
- **Testing**: Vitest, React Testing Library
- **Build**: Vite, TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd caduceus

# Install dependencies
pnpm install

# Run in development mode
pnpm dev
```

### Building

```bash
# Build for production
pnpm build

# Run production build
pnpm start
```

### Testing

```bash
# Run unit tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

## Project Structure

```
caduceus/
├── src/
│   ├── main/              # Electron main process
│   │   ├── database/      # SQLite connection & migrations
│   │   ├── ipc/          # IPC handlers
│   │   ├── services/     # Business logic
│   │   └── window/       # Window management
│   ├── preload/          # Preload scripts
│   ├── renderer/         # React frontend
│   │   ├── features/     # Feature-based modules
│   │   ├── shared/       # Shared components & utils
│   │   └── components/   # UI components
│   └── shared/           # Shared types
├── dist/                 # Build output
└── tests/                # Test files
```

## Architecture

### Frontend
- **Feature-based organization**: Each feature has its own folder
- **Shared components**: Reusable UI components
- **Clean architecture**: Separation of concerns

### Backend
- **Repository pattern**: Data access abstraction
- **Service layer**: Business logic
- **IPC communication**: Secure main-renderer communication

## Development

### Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Run production build
- `pnpm test` - Run tests
- `pnpm rebuild` - Rebuild native modules

### Code Style

- TypeScript strict mode
- ESLint for linting
- Prettier for formatting
- Conventional commits

## Roadmap

### v0.2.0 (Planned)
- Patient medical history
- Appointment scheduling
- Basic reporting

### v0.3.0 (Planned)
- Multi-user support
- Data export/import
- Backup functionality

### v1.0.0 (Future)
- Complete patient records
- Advanced search & filtering
- Print templates
- Data encryption

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Electron](https://www.electronjs.org/) for the desktop framework
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
