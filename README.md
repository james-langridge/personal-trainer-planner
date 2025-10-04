# Personal Trainer Planner

A client management and scheduling system for personal trainers built with
Next.js 15, PostgreSQL, and TypeScript.

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 15.1.3 with App Router and React 19
- **Language**: TypeScript 5.7
- **Database**: PostgreSQL with Prisma ORM 6.3.1
- **Authentication**: Auth.js v5 (NextAuth) with JWT strategy and credentials
  provider
- **UI Components**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS 3.2 with custom configuration
- **State Management**: TanStack Query (React Query) v5 for server state
- **Forms**: React Hook Form with Zod validation
- **CMS Integration**: Contentful for dynamic content
- **Email**: Resend for transactional emails (invoices, password resets, form submissions)
- **Calendar Integration**: Google Calendar API for appointment synchronization
- **Error Monitoring**: Sentry
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Deployment**: Vercel with GitHub Actions CI/CD

### Application Structure

```
├── app/                      # Next.js App Router pages and API routes
│   ├── (users)/             # Protected routes for authenticated users
│   │   ├── appointment/     # Individual appointment views
│   │   ├── bootcamp/        # Group class views
│   │   ├── calendar/        # Main calendar interface
│   │   └── forms/          # Dynamic forms from Contentful
│   ├── admin/              # Admin-only routes (role-based)
│   │   ├── bootcamps/      # Bootcamp management
│   │   ├── calendar/       # Admin calendar view
│   │   └── users/          # User management interface
│   ├── api/               # API routes
│   │   └── auth/          # Authentication endpoints
│   ├── actions/           # Server actions for data mutations
│   └── hooks/             # Custom React hooks for data fetching
├── features/              # Feature-based components
│   ├── bootcamps/        # Bootcamp-specific components
│   ├── calendar/         # Calendar components
│   │   ├── appointment/  # Appointment event components
│   │   ├── bootcamp/     # Bootcamp event components
│   │   ├── desktop/      # Desktop calendar layout
│   │   ├── mobile/       # Mobile calendar layout
│   │   └── workout/      # Workout event components
│   └── users/            # User management components
├── components/           # Shared UI components (shadcn/ui)
├── lib/                  # Core utilities and business logic
├── prisma/              # Database schema and migrations
├── server/              # Standalone server (if needed)
├── e2e/                 # End-to-end tests
└── public/              # Static assets
```

## Data Model

### Core Entities

The application manages three primary event types and two user types:

#### Event Types

1. **Appointments** (`EVENT_TYPE.APPOINTMENT`)

   - One-on-one training sessions
   - Fee-based with billing tracking
   - Attendance status tracking (ATTENDED/NOT_ATTENDED)
   - Associated with individual users
   - Automatic synchronization with Google Calendar

2. **Bootcamps** (`EVENT_TYPE.BOOTCAMP`)

   - Group training sessions
   - Credit-based attendance system
   - Many-to-many relationship with users
   - No individual fees

3. **Workouts** (`EVENT_TYPE.WORKOUT`)
   - Assigned exercise programs
   - Status tracking (NOT_STARTED/COMPLETED)
   - Individual user assignments

#### User Types

- **INDIVIDUAL**: Standard clients with per-appointment fees
- **BOOTCAMP**: Group class participants using a credit system

### Database Schema

The PostgreSQL database uses Prisma ORM with the following main models:

- `User`: Core user entity with authentication, billing, and type information
- `Appointment`: Individual training sessions with fees and attendance
- `Bootcamp`: Group sessions with attendee relationships
- `Workout`: Exercise assignments with completion status
- `Invoice`: Billing records aggregating appointments
- `Account`, `Session`, `VerificationToken`: Auth.js authentication models

## Authentication & Authorization

### Authentication Flow

1. **Credentials Provider**: Email/password authentication with bcrypt hashing
2. **JWT Strategy**: Stateless session management with 30-day expiry
3. **Role-Based Access**: Two roles - `user` (clients) and `admin` (trainers)
4. **Password Reset**: Token-based reset flow via email

### Protected Routes

- `/admin/*`: Requires admin role
- `/(users)/*`: Requires authentication
- Public routes: `/auth/*`, root page

## Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Environment Configuration

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Required environment variables:

**Database:**

- `DATABASE_URL`: PostgreSQL connection string

**Authentication:**

- `NEXTAUTH_SECRET`: Random string for JWT signing
- `NEXTAUTH_URL`: Application URL (http://localhost:3000 for development)

**Email (Resend):**

- `RESEND_API_KEY`: API key from [resend.com](https://resend.com)
- `EMAIL_FROM`: Sender email address (must use verified Resend domain, e.g., noreply@send.yourdomain.com)
- `EMAIL_TO`: Admin email for receiving form submissions

**Contentful CMS:**

- `CONTENTFUL_SPACE_ID`: Space identifier
- `CONTENTFUL_ACCESS_TOKEN`: Content Delivery API token
- `CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN`: Management API token

**Google Calendar (Optional):**

- `GOOGLE_CALENDAR_ID`: Calendar ID for appointment sync
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Service account email
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`: Service account private key
- `TIME_ZONE`: Timezone for calendar events (default: Europe/London)

**Branding:**

- `PT_BRAND_NAME`: Business name
- `NEXT_PUBLIC_PT_FIRST_NAME`: Trainer's first name for UI

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed

# Start development server
npm run dev
```

The application runs at http://localhost:3000

### Database Setup

For local development with Docker:

```bash
docker run --name ptp-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=ptp \
  -p 5432:5432 \
  -d postgres
```

## Development Commands

```bash
npm run dev                    # Start development server with Turbopack
npm run build                  # Build for production
npm run start                  # Start production server
npm run lint                   # Run ESLint with auto-fix
npm run format                 # Format code with Prettier
npm run test:unit             # Run unit tests (Vitest)
npm run test:e2e              # Run E2E tests (Playwright)
npm test                      # Run all tests
npx prisma migrate dev        # Create new migration
npx prisma studio             # Open Prisma Studio GUI
```

## Key Implementation Patterns

### Data Fetching

1. **Server Components**: Direct database queries via Prisma in RSC
2. **Client Components**: TanStack Query for mutations and optimistic updates
3. **Server Actions**: Form submissions and data mutations
4. **Prefetching**: Adjacent month calendar data prefetching

### State Management

- **Server State**: TanStack Query with stale-while-revalidate
- **Form State**: React Hook Form with Zod schemas
- **URL State**: Query parameters for calendar navigation

### Calendar Implementation

The calendar features responsive design with separate implementations:

- **Desktop**: Full month grid view with drag interactions
- **Mobile**: Compact week view with touch optimization
- **Event Types**: Color-coded by type with distinct UI patterns

### Billing System

1. **Appointment Fees**: Tracked per appointment with attendance status
2. **Invoice Generation**: Monthly aggregation of attended appointments
3. **Credit System**: Pre-purchased credits for bootcamp attendance
4. **Email Invoices**: Automated monthly billing emails

## Google Calendar Integration

The application supports automatic synchronization of appointments with Google
Calendar using a service account. This allows trainers to manage their schedule
in one place while keeping their Google Calendar updated.

### Features

- **Automatic Sync**: Appointments are automatically added to Google Calendar
  when created
- **Bidirectional Updates**: Changes to appointments update the corresponding
  Google Calendar events
- **Soft Delete Handling**: Deleted appointments are removed from Google
  Calendar
- **Resilient Sync**: Database operations succeed even if Google Calendar sync
  fails
- **User Feedback**: Toast notifications inform users of sync status

### Setup

1. Create a Google Cloud project and enable the Calendar API
2. Create a service account and download the JSON key file
3. Share your Google Calendar with the service account email (with write
   permissions)
4. Add the following environment variables:
   - `GOOGLE_CALENDAR_ID`: Your calendar ID (found in Calendar settings)
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Service account email
   - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`: Private key from JSON file
   - `TIME_ZONE`: Your timezone (e.g., 'Europe/London')

### Implementation Details

- Appointments store the Google Calendar event ID for tracking
- Batch operations for creating multiple recurring appointments
- Graceful error handling with user notifications
- Manual retry capability for failed syncs (via
  `syncAppointmentToGoogleCalendar`)

## Testing Strategy

### Unit Testing (Vitest)

- Business logic in `/lib`
- Component testing with React Testing Library
- Mock external dependencies via MSW

### E2E Testing (Playwright)

- Critical user flows
- Multi-browser testing (Chrome, Safari)
- Mobile viewport testing
- CI integration with GitHub Actions

## Deployment

### Production Environment

- **Hosting**: Vercel with automatic deployments
- **Database**: PostgreSQL on Railway or similar
- **Environment**: Separate staging and production configs
- **Monitoring**: Sentry for error tracking

### CI/CD Pipeline

GitHub Actions workflow:

1. Runs linting and formatting checks
2. Executes unit and E2E test suites
3. Builds production bundle
4. Deploys to Vercel on merge to main

### Database Backups

Automated backup script available:

```bash
npm run backup
```

## Performance Considerations

- **Turbopack**: Fast HMR in development
- **Server Components**: Reduced client bundle size
- **Image Optimization**: Next.js Image component with remote patterns
- **Code Splitting**: Automatic route-based splitting
- **Prefetching**: Strategic data prefetching for calendar navigation

## Security

- **Authentication**: Secure JWT implementation with httpOnly cookies
- **Password Storage**: bcrypt hashing with salt rounds
- **Input Validation**: Zod schemas on all user inputs
- **SQL Injection**: Protected via Prisma parameterized queries
- **CORS**: Configured for production domains
- **Environment Variables**: Sensitive data never committed to repository

## Contributing

1. Branch from `main`
2. Follow existing code patterns and conventions
3. Write tests for new features
4. Ensure all tests pass before submitting PR
5. Update documentation as needed

## License

MIT
