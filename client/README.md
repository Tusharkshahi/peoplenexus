# PeopleNexus - HR Management System

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
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.
