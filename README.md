# TickTock - Timesheet Management System

A full-stack timesheet management application built with React, TypeScript, Node.js, Express, and MongoDB.

## 🌐 Live Demo

- **Frontend:** https://ticktock-tau.vercel.app/login
- **Backend API:** https://ticktock-backend.vercel.app/

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Frontend Documentation](#frontend-documentation)
- [Backend Documentation](#backend-documentation)
- [Packages Used](#packages-used)
- [Reusable Components](#reusable-components)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)

## 🎯 Overview

TickTock is a comprehensive timesheet management system that allows users to:
- Register and authenticate
- Create and manage weekly timesheets
- Track daily tasks with hours and descriptions
- View timesheet status and progress
- Filter and paginate through timesheets

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **date-fns** - Date utilities

### Backend
- **Node.js** - Runtime
- **Express 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Validation

## ✨ Features

### Authentication
- User registration
- Secure login with JWT tokens
- Protected routes
- Session management

### Timesheet Management
- Create weekly timesheets
- Add, update, and delete daily tasks
- Track hours per day
- Calculate total weekly hours
- Status tracking (completed/incomplete/missing)

### User Interface
- Responsive design
- Modern UI with Tailwind CSS
- Toast notifications
- Loading states
- Error handling
- Form validation
- Pagination
- Filtering

## 📁 Project Structure

```
tentwenty/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── context/         # React Context
│   │   ├── hooks/           # Custom hooks
│   │   ├── routes/          # Route configuration
│   │   ├── constants/       # Constants
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                  # Node.js backend API
│   ├── controllers/         # Request handlers
│   ├── models/              # Mongoose models
│   ├── routes/              # Express routes
│   ├── middlewares/         # Custom middleware
│   ├── database/            # DB configuration
│   ├── scripts/             # Utility scripts
│   └── package.json
│
├── FRONTEND.md              # Frontend documentation
├── BACKEND.md               # Backend documentation
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=https://ticktock-backend.vercel.app" > .env

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/timesheet
JWT_SECRET=your_secret_key_here
NODE_ENV=development
EOF

# Start development server
npm run dev
```

The backend will be available at `http://localhost:5000`

### Database Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in backend `.env`
3. (Optional) Seed sample data:
   ```bash
   cd backend
   npm run seed
   ```

## 📦 Packages Used

### Frontend Packages

#### Core
- `react` (^19.2.0) - React library
- `react-dom` (^19.2.0) - React DOM renderer
- `typescript` (~5.9.3) - TypeScript compiler

#### Build & Dev Tools
- `vite` (^7.2.4) - Build tool
- `@vitejs/plugin-react` (^5.1.1) - Vite React plugin
- `eslint` (^9.39.1) - Linter
- `typescript-eslint` (^8.46.4) - TypeScript ESLint

#### UI & Styling
- `tailwindcss`  - CSS framework
- `@tailwindcss/vite`  - Tailwind Vite plugin
- `lucide-react` - Icon library

#### Routing & State
- `react-router-dom` - Client-side routing

#### Forms & Validation
- `react-hook-form`  - Form management

#### HTTP & API
- `axios`  - HTTP client

#### Utilities
- `date-fns` - Date manipulation
- `react-hot-toast` - Toast notifications

### Backend Packages

#### Core
- `express` (^5.2.1) - Web framework
- `mongoose` (^9.1.3) - MongoDB ODM

#### Authentication & Security
- `jsonwebtoken` - JWT tokens
- `bcryptjs` - Password hashing
- `cors`  - CORS middleware

#### Validation
- `joi`  - Schema validation

#### Utilities
- `dotenv`  - Environment variables
- `nodemon` - Dev server (dev dependency)

## 🧩 Reusable Components

### Frontend Components

All components are located in `frontend/src/components/`

#### 1. **Button** (`Button.tsx`)
Versatile button with variants and loading states.
- Variants: primary, secondary, danger, ghost
- Loading state with spinner
- Full width option

#### 2. **Input** (`Input.tsx`)
Flexible input supporting text and textarea.
- Label, error, and helper text
- Required field indicator
- Error state styling

#### 3. **Select** (`Select.tsx`)
Styled dropdown select.
- Options array support
- Error handling
- Label and helper text

#### 4. **Modal** (`Modal.tsx`)
Reusable modal dialog.
- Multiple sizes (sm, md, lg, xl)
- Custom footer
- Close button option

#### 5. **ConfirmationModal** (`ConfirmationModal.tsx`)
Specialized confirmation dialog.

#### 6. **Loader** (`Loader.tsx`)
Loading spinner component.
- Multiple sizes (sm, md, lg)
- Full screen option
- Optional text

#### 7. **StatusBadge** (`StatusBadge.tsx`)
Status indicator badge.
- Color-coded statuses
- Supports: completed, incomplete, missing

#### 8. **DateRangePicker** (`DateRangePicker.tsx`)
Date range selection component.

#### 9. **DropdownMenu** (`DropdownMenu.tsx`)
Dropdown menu component.

#### 10. **HoursInput** (`HoursInput.tsx`)
Specialized input for time/hours entry.

#### 11. **Navbar** (`Navbar.tsx`)
Navigation bar with authentication state.

#### 12. **Pagination** (`Pagination.tsx`)
Pagination controls for tables/lists.

#### 13. **TableHeader** (`TableHeader.tsx`)
Table header with sorting capabilities.

## 📡 API Documentation

### Base URLs
- **Production:** `https://ticktock-backend.vercel.app/api`
- **Local:** `http://localhost:5000/api`

### Authentication
All timesheet endpoints require JWT authentication via `Authorization: Bearer <token>` header.

### Endpoints

#### User Endpoints
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - Login user
- `GET /api/user/get` - Get current user (protected)
- `POST /api/user/logout` - Logout user (protected)

#### Timesheet Endpoints
- `POST /api/timesheet` - Create or get weekly timesheet (protected)
- `GET /api/timesheet` - Get all timesheets (protected)
- `GET /api/timesheet/:id` - Get timesheet by ID (protected)
- `POST /api/timesheet/:id/task` - Add daily task (protected)
- `PUT /api/timesheet/:id/task/:taskId` - Update task (protected)
- `DELETE /api/timesheet/:id/task/:taskId` - Delete task (protected)

For detailed API documentation, see [BACKEND.md](./BACKEND.md)

## 🚢 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL`

### Backend (Vercel)
1. Connect GitHub repository to Vercel
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT`

## 📚 Additional Documentation

- [Frontend Documentation](./FRONTEND.md) - Detailed frontend documentation
- [Backend Documentation](./BACKEND.md) - Detailed backend documentation

## 🔒 Security

- Password hashing with bcryptjs
- JWT token-based authentication
- CORS configuration
- Input validation
- Protected API routes
- Environment variable management

## 🧪 Development

### Frontend Scripts
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
```

### Backend Scripts
```bash
npm start        # Start production server
npm run dev      # Start dev server (nodemon)
npm run seed     # Seed sample data
npm run clear    # Clear database
```

## 📝 License

ISC

## 👥 Author

Kiran

---

For more detailed information, please refer to:
- [Frontend Documentation](./FRONTEND.md)
- [Backend Documentation](./BACKEND.md)
