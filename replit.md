# Overview

This is a Fraud Monitoring & Alert Investigation SaaS platform with role-based dashboards. The system enables businesses to monitor fraudulent activities, investigate alerts, and track system performance through two distinct user interfaces: an executive dashboard for business heads and a detailed investigation dashboard for analysts.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React + Vite**: Modern React application with Vite for fast development and building
- **TypeScript**: Full type safety across the application
- **TailwindCSS + shadcn/ui**: Utility-first CSS framework with pre-built component library
- **Wouter**: Lightweight client-side routing
- **TanStack Query**: Server state management and caching
- **Recharts**: Data visualization for charts and analytics

## Backend Architecture
- **Node.js + Express**: RESTful API server with TypeScript
- **Session-based Authentication**: Passport.js with local strategy for user authentication
- **Role-based Access Control**: Two user roles (BUSINESS_HEAD, ANALYST) with different permissions
- **Zod Validation**: Schema validation for API requests and responses

## Data Storage
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL
- **Drizzle ORM**: Type-safe database operations and schema management
- **Session Store**: PostgreSQL-backed session storage for user authentication

## Database Schema Design
The application uses a comprehensive schema covering:
- **Users**: Role-based user accounts with authentication
- **Customers**: Customer profiles with risk assessment data
- **Alerts**: Fraud detection alerts with severity levels and investigation status
- **Transactions**: Financial transaction records linked to customers and alerts
- **Fraud Cases**: Confirmed fraud cases with investigation details
- **Investigation Notes**: Analyst notes and comments during investigation
- **Audit Logs**: System activity tracking for compliance
- **System Metrics**: Performance and monitoring data

## Authentication & Authorization
- **Passport.js Local Strategy**: Username/password authentication with hashed passwords
- **Express Sessions**: Server-side session management with PostgreSQL storage
- **Role-based Middleware**: API endpoint protection based on user roles
- **Protected Routes**: Client-side route protection with authentication checks

## Component Architecture
- **Layout Components**: Reusable layout structure with sidebar navigation and header
- **UI Components**: shadcn/ui component library for consistent design
- **Chart Components**: Custom Recharts wrappers for fraud analytics visualization
- **Modal Components**: Investigation modal for detailed alert analysis

## API Design
RESTful API structure with:
- **Authentication endpoints**: Login, logout, registration, user profile
- **Alert management**: CRUD operations with filtering and pagination
- **Analytics endpoints**: KPIs, trends, and geographic data
- **Investigation tools**: Notes, fraud marking, and audit logging

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## Authentication
- **Passport.js**: Authentication middleware with local strategy support
- **bcrypt/scrypt**: Password hashing for secure credential storage

## UI/UX Libraries
- **Radix UI**: Headless UI components for accessibility and customization
- **Lucide React**: Icon library for consistent iconography
- **Recharts**: Chart library for data visualization

## Development Tools
- **Vite**: Build tool and development server
- **ESBuild**: JavaScript bundler for production builds
- **TypeScript**: Type checking and compilation

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional CSS class handling
- **zod**: Runtime schema validation
- **nanoid**: Unique ID generation