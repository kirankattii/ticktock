# Frontend Documentation

## Overview
The frontend is a React + TypeScript application built with Vite, providing a modern and responsive user interface for the timesheet management system.

## Deployed Link
**Production URL:** https://ticktock-tau.vercel.app/login

## Tech Stack

### Core Dependencies
- **React**  - UI library
- **React DOM**  - React rendering
- **TypeScript**  - Type safety
- **Vite** - Build tool and dev server

### UI & Styling
- **Tailwind CSS**  - Utility-first CSS framework
- **@tailwindcss/vite**  - Tailwind integration for Vite
- **lucide-react**  - Icon library

### Routing & State Management
- **react-router-dom**  - Client-side routing
- **React Context API** - Global state management (AuthContext)

### Form Handling & Validation
- **react-hook-form**  - Form state management and validation

### HTTP Client
- **axios**  - HTTP client for API requests

### Utilities
- **date-fns** - Date manipulation and formatting
- **react-hot-toast**  - Toast notifications

### Development Dependencies
- **@vitejs/plugin-react**  - Vite plugin for React
- **ESLint**  - Code linting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **@types/react** - TypeScript types for React
- **@types/react-dom**  - TypeScript types for React DOM
- **@types/node**  - TypeScript types for Node.js

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/               # Page components
│   │   ├── dashboard/      # Dashboard page and components
│   │   ├── login/          # Login page
│   │   └── weeklyTimesheet/ # Weekly timesheet page
│   ├── services/           # API service layer
│   ├── context/            # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── routes/             # Route configuration
│   ├── constants/          # Application constants
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── package.json            # Dependencies and scripts
```

## Reusable Components

### 1. Button
A versatile button component with multiple variants and loading states.

**Usage:**
```tsx
<Button variant="primary" onClick={handleClick} loading={isLoading}>
  Submit
</Button>
```

### 2. Input
A flexible input component that supports both text input and textarea.

**Usage:**
```tsx
<Input
  label="Email"
  type="email"
  required
  error={errors.email}
  value={email}
  onChange={handleChange}
/>
```

### 3. Select
A styled select dropdown component.

**Usage:**
```tsx
<Select
  label="Status"
  options={[
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" }
  ]}
  value={status}
  onChange={handleChange}
/>
```

### 4. Modal
A reusable modal dialog component.

**Usage:**
```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Action"
  footer={<Button onClick={handleConfirm}>Confirm</Button>}
>
  <p>Are you sure?</p>
</Modal>
```

### 5. ConfirmationModal
A specialized modal for confirmation dialogs.

**Location:** `src/components/ConfirmationModal.tsx`

### 6. Loader
A loading spinner component with multiple sizes.

**Usage:**
```tsx
<Loader size="md" text="Loading..." fullScreen />
```

### 7. StatusBadge
A badge component for displaying status with color coding.

**Usage:**
```tsx
<StatusBadge status="completed" />
```

### 8. DateRangePicker
A date range selection component.

**Location:** `src/components/DateRangePicker.tsx`

### 9. DropdownMenu
A dropdown menu component.

**Location:** `src/components/DropdownMenu.tsx`

### 10. HoursInput
A specialized input for time/hours entry.

**Location:** `src/components/HoursInput.tsx`

### 11. Navbar
Navigation bar component.

**Location:** `src/components/Navbar.tsx`

### 12. Pagination
Pagination component for tables/lists.

**Location:** `src/components/Pagination.tsx`

### 13. TableHeader
Table header component with sorting capabilities.

**Location:** `src/components/TableHeader.tsx`

## Pages

### 1. Login Page
**Location:** `src/pages/login/Login.tsx`

User authentication page with email and password login.

### 2. Dashboard Page
**Location:** `src/pages/dashboard/Dashboard.tsx`

Main dashboard displaying weekly timesheets with filtering and pagination.

**Components:**
- `Filter.tsx` - Filtering controls
- `Table.tsx` - Timesheet table
- `CreateWeekModal.tsx` - Modal for creating new week

### 3. Weekly Timesheet Page
**Location:** `src/pages/weeklyTimesheet/weeklyTimeSheet.tsx`

Detailed view for managing daily tasks within a weekly timesheet.

**Components:**
- `HoursProgress.tsx` - Progress indicator for hours
- `ManageModel.tsx` - Modal for managing tasks

## Services

### API Service
**Location:** `src/services/api.ts`

Axios instance configuration with base URL and interceptors.

### Auth Service
**Location:** `src/services/auth.service.ts`

Authentication-related API calls (login, register, logout).

### Timesheet Service
**Location:** `src/services/timesheet.service.ts`

Timesheet-related API calls (CRUD operations).

## Context

### AuthContext
**Location:** `src/context/AuthContext.tsx`

Global authentication state management providing:
- User authentication state
- Login/logout functions
- Protected route handling

## Hooks

### useClickOutside
**Location:** `src/hooks/useClickOutside.ts`

Custom hook for detecting clicks outside an element (useful for dropdowns and modals).

## Utilities

### dateFormat
**Location:** `src/utils/dateFormat.ts`

Date formatting utilities using date-fns.

### validation
**Location:** `src/utils/validation.ts`

Form validation schemas and helper functions.

## Constants

### filter.ts
**Location:** `src/constants/filter.ts`

Filter-related constants and configurations.

### timesheet.ts
**Location:** `src/constants/timesheet.ts`

Timesheet-related constants.

## Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=https://ticktock-backend.vercel.app
```

## Features

- ✅ User authentication (Login/Register)
- ✅ Protected routes
- ✅ Weekly timesheet management
- ✅ Daily task tracking
- ✅ Hours tracking and progress
- ✅ Status management (completed/incomplete/missing)
- ✅ Filtering and pagination
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling

## Build & Deployment

The application is configured for deployment on Vercel. The build process:
1. Type checks the TypeScript code
2. Builds the production bundle using Vite
3. Outputs to `dist/` directory

**Vercel Configuration:** `vercel.json`
