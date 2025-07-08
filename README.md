# Task Manager Application

A comprehensive task management application built with Node.js, Express, MongoDB, and React. This application provides user authentication, task creation and assignment, real-time notifications, and team collaboration features.

## Features

### 🔐 User Authentication
- Secure user registration and login
- JWT-based authentication
- Role-based access control (User, Manager, Admin)
- Protected routes and API endpoints

### 📋 Task Management
- Create, read, update, and delete tasks
- Task assignment to team members
- Task categorization and prioritization
- Due date tracking and reminders
- Task status tracking (Pending, In Progress, Completed, Cancelled)
- Task comments and collaboration

### 🔔 Notifications
- Real-time notifications using Socket.IO
- Email notifications for task assignments and due dates
- In-app notification system
- Notification management (mark as read, delete)

### 📊 Dashboard & Analytics
- Comprehensive dashboard with task statistics
- Visual task overview with charts
- Quick actions and shortcuts
- User profile management

### 🎨 Modern UI/UX
- Responsive design for all devices
- Clean and intuitive interface
- Real-time updates
- Loading states and error handling

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Socket.IO** - Real-time communication
- **Nodemailer** - Email notifications
- **Node-cron** - Scheduled tasks
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **date-fns** - Date formatting

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd task-manager
```

2. Install backend dependencies:
```bash
npm install
```

3. Create environment variables:
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# Email configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Client URL
CLIENT_URL=http://localhost:3000
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/users` - Get all users
- `POST /api/auth/logout` - Logout user

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/comments` - Add comment to task
- `GET /api/tasks/stats/overview` - Get task statistics

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/stats` - Get notification statistics

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user, admin, manager),
  avatar: String,
  department: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date
}
```

### Task Model
```javascript
{
  title: String,
  description: String,
  status: String (pending, in-progress, completed, cancelled),
  priority: String (low, medium, high, urgent),
  category: String,
  assignedTo: ObjectId (User),
  assignedBy: ObjectId (User),
  dueDate: Date,
  startDate: Date,
  completedDate: Date,
  estimatedHours: Number,
  actualHours: Number,
  tags: [String],
  attachments: [Object],
  comments: [Object],
  project: String,
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Model
```javascript
{
  user: ObjectId (User),
  task: ObjectId (Task),
  type: String (task_assigned, task_due, task_completed, task_overdue, task_commented),
  title: String,
  message: String,
  isRead: Boolean,
  priority: String,
  createdAt: Date,
  readAt: Date
}
```

## Features in Detail

### Task Assignment & Management
- Assign tasks to specific users
- Set due dates and priorities
- Track task progress with status updates
- Add comments for collaboration
- Categorize tasks by project or type

### Real-time Notifications
- Instant notifications for task assignments
- Due date reminders
- Task completion notifications
- Comment notifications
- Email notifications (configurable)

### Dashboard Analytics
- Task completion statistics
- Overdue task tracking
- Personal task overview
- Team performance metrics

### User Management
- Role-based permissions
- User profiles with avatars
- Department-based organization
- Activity tracking

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment (development/production) | development |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/taskmanager |
| JWT_SECRET | JWT secret key | Required |
| JWT_EXPIRE | JWT expiration time | 30d |
| EMAIL_HOST | SMTP host | smtp.gmail.com |
| EMAIL_PORT | SMTP port | 587 |
| EMAIL_USER | SMTP username | Optional |
| EMAIL_PASS | SMTP password | Optional |
| CLIENT_URL | Frontend URL | http://localhost:3000 |

## Development

### Running in Development Mode

Backend:
```bash
npm run dev
```

Frontend:
```bash
cd client
npm start
```

### Building for Production

Backend:
```bash
npm start
```

Frontend:
```bash
cd client
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request


