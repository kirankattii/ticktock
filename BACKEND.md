# Backend Documentation

## Overview
The backend is a Node.js + Express REST API with MongoDB, providing authentication and timesheet management functionality.

## Deployed Link
**Production URL:** https://ticktock-backend.vercel.app/

## Tech Stack

### Core Dependencies
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Authentication & Security
- **jsonwebtoken**  - JWT token generation and verification
- **bcryptjs**  - Password hashing

### Validation
- **Joi**  - Schema validation library

### Utilities
- **dotenv**  - Environment variable management
- **cors**  - Cross-Origin Resource Sharing middleware

### Development Dependencies
- **nodemon**  - Development server with auto-reload

## Project Structure

```
backend/
├── controllers/          # Request handlers
│   ├── UserController.js
│   └── TimesheetController.js
├── models/              # Mongoose models
│   ├── User.js
│   ├── WeeklyTimesheet.js
│   └── DailyTask.js
├── routes/              # Express routes
│   ├── userRoute.js
│   └── timesheetRoute.js
├── middlewares/         # Custom middleware
│   └── authMiddleware.js
├── database/            # Database configuration
│   └── db.js
├── scripts/             # Utility scripts
│   ├── seedData.js
│   └── clearData.js
├── server.js            # Application entry point
├── vercel.json          # Vercel deployment config
└── package.json         # Dependencies and scripts
```

## API Endpoints

### Base URL
```
Production: https://ticktock-backend.vercel.app/api
Local: http://localhost:PORT/api
```

### User Routes (`/api/user`)

#### Register User
- **POST** `/api/user/register`
- **Description:** Register a new user
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "token": "jwt_token_here"
    }
  }
  ```

#### Login User
- **POST** `/api/user/login`
- **Description:** Authenticate user and get JWT token
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "token": "jwt_token_here"
    }
  }
  ```

#### Get User
- **GET** `/api/user/get`
- **Description:** Get current authenticated user
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

#### Logout User
- **POST** `/api/user/logout`
- **Description:** Logout user (clears token)
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Logout successful"
  }
  ```

### Timesheet Routes (`/api/timesheet`)

All timesheet routes require authentication via JWT token.

#### Create or Get Weekly Timesheet
- **POST** `/api/timesheet`
- **Description:** Create a new weekly timesheet or get existing one for the week
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "weekStartDate": "2024-01-01",
    "weekEndDate": "2024-01-07"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "...",
      "weekStartDate": "2024-01-01",
      "weekEndDate": "2024-01-07",
      "dailyTasks": [],
      "totalHours": 0
    }
  }
  ```

#### Get All Weekly Timesheets
- **GET** `/api/timesheet`
- **Description:** Get all weekly timesheets for the authenticated user
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `page` (optional) - Page number for pagination
  - `limit` (optional) - Items per page
  - `status` (optional) - Filter by status
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "timesheets": [...],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 5,
        "pages": 1
      }
    }
  }
  ```

#### Get Weekly Timesheet by ID
- **GET** `/api/timesheet/:id`
- **Description:** Get a specific weekly timesheet
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "...",
      "weekStartDate": "2024-01-01",
      "weekEndDate": "2024-01-07",
      "dailyTasks": [...],
      "totalHours": 40
    }
  }
  ```

#### Add Daily Task
- **POST** `/api/timesheet/:id/task`
- **Description:** Add a daily task to a weekly timesheet
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "date": "2024-01-01",
    "hours": 8,
    "description": "Work on project"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Task added successfully",
    "data": {
      "task": {
        "id": "...",
        "date": "2024-01-01",
        "hours": 8,
        "description": "Work on project"
      }
    }
  }
  ```

#### Update Daily Task
- **PUT** `/api/timesheet/:id/task/:taskId`
- **Description:** Update an existing daily task
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "date": "2024-01-01",
    "hours": 7,
    "description": "Updated description"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Task updated successfully",
    "data": {
      "task": {...}
    }
  }
  ```

#### Delete Daily Task
- **DELETE** `/api/timesheet/:id/task/:taskId`
- **Description:** Delete a daily task
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Task deleted successfully"
  }
  ```

## Database Models

### User Model
**Location:** `models/User.js`

**Schema:**
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, lowercase),
  password: String (required, min 8 chars),
  token: String (default: null),
  timestamps: true
}
```

### WeeklyTimesheet Model
**Location:** `models/WeeklyTimesheet.js`

**Schema:**
```javascript
{
  user: ObjectId (ref: User, required),
  weekStartDate: Date (required),
  weekEndDate: Date (required),
  dailyTasks: [DailyTask],
  timestamps: true,
  virtual: totalHours (sum of daily task hours)
}
```

### DailyTask Model
**Location:** `models/DailyTask.js`

**Schema:**
```javascript
{
  date: Date (required),
  hours: Number (required, min: 0, max: 24),
  description: String (optional)
}
```

## Middleware

### Authentication Middleware
**Location:** `middlewares/authMiddleware.js`

Validates JWT tokens and attaches user information to the request object.

**Usage:**
```javascript
router.use(authMiddleware); // Apply to all routes
// or
router.get("/route", authMiddleware, handler); // Apply to specific route
```

## Controllers

### UserController
**Location:** `controllers/UserController.js`

Handles user-related operations:
- `registerUser` - User registration
- `loginUser` - User authentication
- `logoutUser` - User logout
- `getUser` - Get user details

### TimesheetController
**Location:** `controllers/TimesheetController.js`

Handles timesheet-related operations:
- `createOrGetWeeklyTimesheet` - Create or retrieve weekly timesheet
- `getAllWeeklyTimesheets` - Get all timesheets with pagination
- `getWeeklyTimesheet` - Get specific timesheet
- `addDailyTask` - Add task to timesheet
- `updateDailyTask` - Update existing task
- `deleteDailyTask` - Delete task

## Scripts

### Utility Scripts

#### Seed Data
**Location:** `scripts/seedData.js`

```bash
npm run seed
```

Populates the database with sample data for testing.

#### Clear Data
**Location:** `scripts/clearData.js`

```bash
npm run clear
```

Clears all data from the database (use with caution).

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/timesheet
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

## Scripts

```bash
# Start production server
npm start

# Start development server (with nodemon)
npm run dev

# Seed database
npm run seed

# Clear database
npm run clear
```

## Error Handling

The API follows a consistent error response format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ CORS configuration
- ✅ Input validation with Joi
- ✅ Protected routes with middleware
- ✅ Environment variable management

## Database Indexes

The WeeklyTimesheet model includes an index for efficient queries:
```javascript
{ user: 1, weekStartDate: 1, weekEndDate: 1 }
```

## Deployment

The backend is configured for deployment on Vercel.

**Vercel Configuration:** `vercel.json`

The server automatically connects to MongoDB using the `MONGODB_URI` environment variable.
