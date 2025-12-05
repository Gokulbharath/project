# NightScene

A modern table management system for nightlife venues built with React, TypeScript, and Vite.

## Features

### Staff Portal
- **Dashboard**: Real-time KPIs (occupancy, reservations, arrivals, payments)
- **Live Table Map**: Interactive table grid with real-time status updates via Socket.IO
- **Arrival Logs**: Track guest arrivals with filtering and animations
- **Walk-in Booking**: Quick booking form for walk-in guests
- **Payments**: Track pending payments and no-show alerts with countdown timers

### Admin Portal
- **Overview**: Business intelligence dashboard with charts
- **Onboarding**: Venue setup and configuration
- **Layout Editor**: Visual table layout management
- **Analytics**: Detailed performance metrics with time filters
- **System Logs**: Audit trail with severity indicators

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Styling**: TailwindCSS + shadcn/ui
- **State**: React Context + Hooks
- **Real-time**: Socket.IO Client
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner

## Design System

- **Theme**: Dark neon with glassmorphism
- **Colors**:
  - Background: `#0A0A0A`
  - Primary: `#4A6CFF`
  - Accent: `#A56CFF`
  - Success: `#00FF90`
  - Reserved: `#4388FF`
  - Occupied: `#FF4466`
- **Typography**: Inter font family
- **Shadows**: Neon glows and soft shadows
- **Animations**: Pulse, glow, slide-in effects

## Project Structure

```
src/
├── components/        # Reusable UI components
├── layouts/          # Page layouts (App, Auth)
├── pages/            # Route pages (staff, admin)
├── services/         # API and Socket.IO services
├── hooks/            # Custom React hooks
├── utils/            # Utility functions and constants
├── types/            # TypeScript type definitions
└── mock/             # Mock JSON data
```

## Getting Started

### Install Dependencies
```bash
npm install
```

### Environment Variables
Create a `.env` file with:
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_URL=ws://localhost:3001
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## Routes

### Staff Routes
- `/login` - Staff login
- `/staff` - Dashboard
- `/staff/table-map` - Live table map
- `/staff/arrivals` - Arrival logs
- `/staff/walkins` - Walk-in booking form
- `/staff/payments` - Payments and no-shows

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/onboarding` - Venue onboarding
- `/admin/layout` - Table layout editor
- `/admin/analytics` - Analytics dashboard
- `/admin/logs` - System logs

## Mock Data

The app uses mock JSON data for development:
- `tables.json` - Table definitions with status
- `bookings.json` - Guest bookings
- `arrivals.json` - Arrival records
- `payments.json` - Payment records
- `analytics.json` - Analytics data
- `logs.json` - System logs

## Socket.IO Integration

The app includes Socket.IO client integration with a custom `useSocket()` hook for real-time updates. Configure the socket server URL via `VITE_SOCKET_URL`.

## Login

Use any email/password combination to access the system (mock authentication).

## Tablet-First Design

Optimized for 1280x800 tablet screens with full desktop support.
