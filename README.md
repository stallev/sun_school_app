# Sunday School App

Web application for automating the management of a Baptist church Sunday school. The system provides a complete cycle of educational process management: lesson creation, homework checking, academic performance tracking, motivation system, and student rankings.

## 📋 Description

Sunday School App is a modern web application built on AWS serverless architecture, designed for:

- **Teachers**: creating lessons, checking homework, viewing student data
- **Administrators**: managing users, groups, academic years, and school settings
- **Students**: viewing their results, rankings, and achievements

### Key Features

- ✅ Lesson and academic year management
- ✅ Homework checking with automatic score calculation
- ✅ Motivation system (points, houses, achievements)
- ✅ Student rankings with gamification
- ✅ Teacher, pupil, and family management
- ✅ Role-based access (Teacher, Admin, Superadmin)
- ✅ Golden verses library
- ✅ Schedule calendar

## 🛠 Tech Stack

### Frontend
- **Next.js 15.5.9** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - type safety
- **Tailwind CSS 4** - utility-first CSS
- **Shadcn UI** - UI components
- **Novel** - WYSIWYG editor for lessons (built on Tiptap)
- **Zustand** - state management (minimal usage)
- **React Hook Form + Zod** - forms and validation

### Backend & Infrastructure
- **AWS Amplify Gen 1** - backend infrastructure
- **AWS DynamoDB** - NoSQL database
- **AWS AppSync** - GraphQL API
- **AWS Cognito** - authentication and authorization
- **AWS S3** - file storage
- **AWS CloudFront** - CDN (via Amplify)

## 📁 Project Structure

```
sun_sch/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth route group
│   │   ├── (private)/         # Protected routes
│   │   └── (admin)/           # Admin routes
│   ├── actions/                # Server Actions
│   │   ├── lessons.ts
│   │   ├── homework.ts
│   │   ├── pupils.ts
│   │   └── ...
│   ├── components/
│   │   ├── ui/                # Shadcn UI components
│   │   ├── teacher/           # Teacher components
│   │   ├── admin/             # Admin components
│   │   └── shared/            # Shared components
│   ├── lib/
│   │   ├── db/
│   │   │   └── amplify.ts     # amplifyData (Data Access Layer)
│   │   └── auth/
│   │       └── cognito.ts      # AWS Cognito helpers
│   ├── hooks/                  # Custom React hooks
│   └── types/                  # TypeScript types
├── amplify/                    # AWS Amplify Gen 1 configuration
│   ├── backend/
│   │   ├── api/               # AppSync/GraphQL config
│   │   └── auth/              # Cognito config
│   └── data/
│       └── schema.graphql      # GraphQL schema
├── docs/                       # Project documentation
│   ├── architecture/          # Architecture documentation
│   ├── implementation/         # Implementation plan
│   ├── guidelines/            # Development guidelines
│   └── ...
└── public/                     # Static files
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.x or higher
- **npm** or **yarn** or **pnpm**
- **AWS CLI** configured with credentials
- **Amplify CLI** version 12.x (Gen 1)

### Install Amplify CLI

```bash
npm install -g @aws-amplify/cli
amplify --version  # Should be version 12.x.x
```

### Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/sun_sch.git
cd sun_sch

# Install dependencies
npm install

# Configure AWS credentials (if not already configured)
amplify configure
```

### Initialize Amplify Project

```bash
# Initialize Amplify project
amplify init

# Follow interactive prompts:
# - Project name: sun-sch
# - Environment: dev
# - Default editor: Visual Studio Code
# - Framework: react
# - Source directory: src
# - Distribution directory: .next
# - Build command: npm run build
# - Start command: npm run dev
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Development Commands

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier

# TypeScript
npx tsc --noEmit     # Type check without building

# Amplify
amplify status       # Check Amplify resources status
amplify push         # Deploy backend changes
amplify console      # Open Amplify Console

# Chrome DevTools MCP (for browser testing)
.\scripts\start-chrome-debug.ps1      # Start Chrome with remote debugging
.\scripts\check-chrome-debug-port.ps1 # Check if port 9222 is available
```

## 🔐 Authentication

The application uses AWS Cognito for authentication:

- **Email/Password** login
- JWT tokens (ID/Access/Refresh) with sessions up to 30 days
- Roles: Teacher, Admin, Superadmin
- Route protection via middleware

### User Roles

- **Teacher** - access to their group, creating lessons, checking homework
- **Admin** - all Teacher capabilities + user and settings management
- **Superadmin** - full access (in MVP identical to Admin)

## 🗄 Database

The database uses **AWS DynamoDB** via **AWS AppSync GraphQL API**.

### Main Entities

- **Grade** - groups (classes)
- **AcademicYear** - academic years
- **Lesson** - lessons
- **Homework** - homework assignments
- **Pupil** - pupils (students)
- **Teacher** - teachers
- **Family** - families
- **GoldenVerse** - golden verses
- **Achievement** - achievements
- **Points** - student points

GraphQL schema is located in `amplify/data/schema.graphql`.

## 📚 Documentation

Full project documentation is located in the `docs/` folder:

- **[MVP_SCOPE.md](docs/MVP_SCOPE.md)** - MVP functionality description
- **[ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md)** - project architecture
- **[AWS_AMPLIFY.md](docs/infrastructure/AWS_AMPLIFY.md)** - AWS Amplify setup
- **[DEVTOOLS_MCP_SETUP.md](docs/infrastructure/DEVTOOLS_MCP_SETUP.md)** - Chrome DevTools MCP server setup for browser testing
- **[DEPLOYMENT_GUIDE.md](docs/deployment/DEPLOYMENT_GUIDE.md)** - deployment guide
- **[GRAPHQL_SCHEMA.md](docs/database/GRAPHQL_SCHEMA.md)** - GraphQL API documentation
- **[IMPLEMENTATION_PHASES.md](docs/implementation/mvp/implementation_phases_list.md)** - implementation plan

### Development Guidelines

- **[Component Guidelines](docs/guidelines/react/ai_component_guidelines.md)** - creating React components
- **[Hooks Guidelines](docs/guidelines/react/ai_react_hooks_guidelines.md)** - using React hooks
- **[Server Actions](docs/api/SERVER_ACTIONS.md)** - Server Actions patterns

## 🚢 Deployment

### AWS Amplify Hosting

The application is deployed via AWS Amplify Hosting:

1. Connect Git repository in AWS Amplify Console
2. Configure branch-to-backend environment mapping:
   - `dev` branch → `dev` backend environment (us-east-1)
   - `master` branch → `prod` backend environment (eu-west-1)
3. Automatic deployment on branch push

For more details: [DEPLOYMENT_GUIDE.md](docs/deployment/DEPLOYMENT_GUIDE.md)

### Multi-Region Setup

- **Dev environment**: `us-east-1` (N. Virginia)
- **Prod environment**: `eu-west-1` (Ireland)

Each environment has completely isolated resources (Cognito, AppSync, DynamoDB, S3).

## 🧪 Development

### Creating Components

Follow guidelines in `docs/guidelines/react/`:

- Use **Server Components** by default
- Add `'use client'` only for interactivity
- Use Shadcn UI components from `components/ui/`
- Follow Atomic Design principles

### Server Actions

All data mutations are performed via Server Actions in `src/actions/`:

- Use `'use server'` directive
- Validation via Zod schemas
- Authentication via AWS Cognito
- Data operations via `amplifyData` from `@/lib/db/amplify`

### TypeScript

- Strict typing, no `any` types allowed
- Types from Zod schemas: `z.infer<typeof Schema>`
- Types from GraphQL schema (auto-generated via Amplify)

## 📊 Project Status

**Current Version:** 0.1.0 (MVP in development)

**Implementation Phases:** 25 phases (see [implementation_phases_list.md](docs/implementation/mvp/implementation_phases_list.md))

**Time Estimate:** 30-40 working days (6-8 weeks)

## 🤝 Contributing

The project is under active development. For questions and suggestions, please create Issues in the repository.

## 📄 License

Private project for Baptist church Sunday school.

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [AWS Amplify Gen 1 Documentation](https://docs.amplify.aws/)
- [AWS AppSync Documentation](https://docs.aws.amazon.com/appsync/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Novel Documentation](https://github.com/steven-tey/novel)

---

**Last Updated:** December 2025
