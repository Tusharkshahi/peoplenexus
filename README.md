# PeopleNexus - HR Management System

A comprehensive Human Resource Management System built with Next.js, Express.js, and PostgreSQL in a monorepo structure.
## 🚀 Features

- **Dashboard**: Overview of key HR metrics and statistics
- **Recruitment**: Job posting management and candidate tracking
- **Onboarding**: New hire onboarding process management
- **Leave Management**: Employee leave requests and calendar view
- **Payroll**: Payroll processing and payslip generation
- **Performance**: Performance reviews and OKR tracking
- **Authentication**: Secure login and registration system
## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: Redux Toolkit
- **Icons**: Lucide React

## 📁 Project Structure
```
src/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── layout.tsx       # Dashboard layout
│   │   ├── dashboard/
│   │   ├── recruitment/
│   │   ├── onboarding/
│   │   ├── leave/
│   │   ├── payroll/
│   │   └── performance/
│   ├── components/          # Shared components
│   │   ├── ui/             # Shadcn UI components
│   │   └── shared/         # Custom shared components
│   ├── lib/                # Utility functions
│   ├── store/              # Redux store
│   │   └── features/       # Redux slices
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
```

## 🚀 Getting Started
### Prerequisites

- Node.js 18+ 
- npm or yarn
### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd peoplenexus-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Available Pages

- **Dashboard**: `/dashboard` - Main dashboard with HR metrics
- **Recruitment**: `/recruitment` - Job posting management
- **Onboarding**: `/onboarding` - New hire tracking
- **Leave Management**: `/leave` - Leave requests and calendar
- **Payroll**: `/payroll` - Payroll processing
- **Performance**: `/performance` - Performance reviews and OKRs
- **Login**: `/login` - Authentication page
- **Register**: `/register` - Registration page

## 🎨 UI Components

The project uses Shadcn UI components for a consistent and accessible design:

- Button, Card, Input, Label
- Table, Avatar, Calendar
- Badge, Progress
- And more...

## 🔧 Development

### Adding New Components

1. Use Shadcn UI CLI to add new components:
```bash
npx shadcn@latest add <component-name>
```

2. Create custom components in `src/components/shared/`

### State Management

The app uses Redux Toolkit for state management:

- Store configuration: `src/store/store.ts`
- Auth slice: `src/store/features/authSlice.ts`

### Styling

- Tailwind CSS for utility-first styling
- Custom CSS variables for theming
- Responsive design with mobile-first approach

## 📦 Build and Deploy

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**PeopleNexus** - Streamlining HR management for modern organizations. 
# PeopleNexus - HR Management System

<<<<<<< HEAD
An intelligent Human Resource Management System (HRMS) built with modern web technologies.

## 🚀 Features

- **Dashboard**: Overview of key HR metrics and statistics
- **Recruitment**: Job posting management and candidate tracking
- **Onboarding**: New hire onboarding process management
- **Leave Management**: Employee leave requests and calendar view
- **Payroll**: Payroll processing and payslip generation
- **Performance**: Performance reviews and OKR tracking
- **Authentication**: Secure login and registration system

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: Redux Toolkit
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── layout.tsx       # Dashboard layout
│   │   ├── dashboard/
│   │   ├── recruitment/
│   │   ├── onboarding/
│   │   ├── leave/
│   │   ├── payroll/
│   │   └── performance/
│   ├── components/          # Shared components
│   │   ├── ui/             # Shadcn UI components
│   │   └── shared/         # Custom shared components
│   ├── lib/                # Utility functions
│   ├── store/              # Redux store
│   │   └── features/       # Redux slices
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
```

## 🚀 Getting Started
=======
A comprehensive Human Resource Management System built with Next.js, Express.js, and PostgreSQL in a monorepo structure.

## 🏗️ Project Structure

```
PeopleNexus/
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # React components
│   │   ├── lib/          # Utility functions
│   │   └── store/        # Redux store
│   ├── public/           # Static assets
│   └── package.json
├── server/                # Express.js backend API
│   ├── routes/           # API route handlers
│   ├── server.js         # Main server file
│   └── package.json
├── shared/                # Shared utilities and types
│   ├── src/
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Shared utility functions
│   └── package.json
└── package.json          # Root workspace configuration
```

## 🚀 Quick Start
>>>>>>> 1a78430 (feat(ai): Azure-backed resume upload; improve ranker/screener flow, add throttling/retries/timeouts; UI: prevent upload loops and align file types)

### Prerequisites

- Node.js 18+ 
- npm or yarn
<<<<<<< HEAD

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd peoplenexus-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Available Pages

- **Dashboard**: `/dashboard` - Main dashboard with HR metrics
- **Recruitment**: `/recruitment` - Job posting management
- **Onboarding**: `/onboarding` - New hire tracking
- **Leave Management**: `/leave` - Leave requests and calendar
- **Payroll**: `/payroll` - Payroll processing
- **Performance**: `/performance` - Performance reviews and OKRs
- **Login**: `/login` - Authentication page
- **Register**: `/register` - Registration page

## 🎨 UI Components

The project uses Shadcn UI components for a consistent and accessible design:

- Button, Card, Input, Label
- Table, Avatar, Calendar
- Badge, Progress
- And more...

## 🔧 Development

### Adding New Components

1. Use Shadcn UI CLI to add new components:
```bash
npx shadcn@latest add <component-name>
```

2. Create custom components in `src/components/shared/`

### State Management

The app uses Redux Toolkit for state management:

- Store configuration: `src/store/store.ts`
- Auth slice: `src/store/features/authSlice.ts`

### Styling

- Tailwind CSS for utility-first styling
- Custom CSS variables for theming
- Responsive design with mobile-first approach

## 📦 Build and Deploy

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```
=======
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PeopleNexus
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp server/env.example server/.env
   
   # Edit the .env file with your database credentials
   nano server/.env
   ```

4. **Set up the database**
   ```bash
   # Create the database
   createdb peoplenexus
   
   # Run the database setup script (if available)
   psql -d peoplenexus -f server/database-setup.sql
   ```

5. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately
   npm run dev:server  # Backend on http://localhost:5000
   npm run dev:client  # Frontend on http://localhost:3000
   ```

## 📦 Available Scripts

### Root Level (Monorepo)
- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:server` - Start only the backend server
- `npm run dev:client` - Start only the frontend application
- `npm run build` - Build all packages
- `npm run install:all` - Install dependencies for all packages
- `npm run clean` - Clean build artifacts
- `npm run lint` - Run linting across all packages
- `npm run test` - Run tests across all packages

### Client (Frontend)
- `npm run dev` - Start Next.js development server
- `npm run build` - Build the Next.js application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

### Server (Backend)
- `npm run dev` - Start the Express server with nodemon
- `npm run start` - Start the production server
- `npm run build` - No build step required for Node.js

### Shared
- `npm run build` - Build TypeScript to JavaScript
- `npm run dev` - Watch mode for TypeScript compilation

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/peoplenexus

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Database Setup

The application uses PostgreSQL. Make sure you have:

1. PostgreSQL installed and running
2. A database named `peoplenexus` created
3. Proper database credentials in your `.env` file

## 🏛️ Architecture

### Frontend (Client)
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **UI Components**: Radix UI primitives
- **TypeScript**: Full type safety

### Backend (Server)
- **Framework**: Express.js
- **Database**: PostgreSQL with `pg` driver
- **Authentication**: JWT with bcrypt
- **Validation**: Zod schemas
- **Security**: Helmet, CORS, Morgan logging

### Shared Package
- **TypeScript**: Shared type definitions
- **Utilities**: Common functions for both frontend and backend
- **Validation**: Zod schemas for API validation

## 📁 Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, HR Manager, Manager, Employee)
- Secure password hashing with bcrypt

### 👥 Employee Management
- Employee profiles and information
- Department and position management
- Skills and certifications tracking

### 📅 Leave Management
- Leave request submission and approval
- Multiple leave types (Annual, Sick, Personal, etc.)
- Leave balance tracking

### 💰 Payroll Management
- Payroll processing and records
- Deductions and allowances
- Overtime calculation

### 📊 Performance Management
- Performance reviews and ratings
- OKR (Objectives and Key Results) tracking
- Goal setting and achievement tracking

### 🎯 Recruitment
- Job posting management
- Application tracking
- Interview scheduling

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- Helmet security headers
- Input validation with Zod
- SQL injection prevention with parameterized queries

## 🧪 Development

### Code Structure
- **Monorepo**: Single repository for frontend, backend, and shared code
- **Type Safety**: Full TypeScript support across all packages
- **Shared Types**: Common interfaces and types in the shared package
- **API-First**: Backend API designed for frontend consumption

### Best Practices
- Consistent error handling
- Standardized API responses
- Environment-based configuration
- Proper logging and monitoring
- Code linting and formatting

## 🚀 Deployment

### Frontend Deployment
The Next.js application can be deployed to:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Any static hosting service

### Backend Deployment
The Express.js API can be deployed to:
- Heroku
- Railway
- DigitalOcean App Platform
- AWS EC2
- Google Cloud Run

### Database
- PostgreSQL on managed services (AWS RDS, Google Cloud SQL, etc.)
- Or self-hosted PostgreSQL
>>>>>>> 1a78430 (feat(ai): Azure-backed resume upload; improve ranker/screener flow, add throttling/retries/timeouts; UI: prevent upload loops and align file types)

## 🤝 Contributing

1. Fork the repository
<<<<<<< HEAD
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.
=======
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**PeopleNexus** - Streamlining HR management for modern organizations. 
>>>>>>> 1a78430 (feat(ai): Azure-backed resume upload; improve ranker/screener flow, add throttling/retries/timeouts; UI: prevent upload loops and align file types)
