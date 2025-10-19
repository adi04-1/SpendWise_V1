# Personal Expense Tracker

## Overview

A personal finance management application for tracking expenses with detailed categorization, budget management, and multi-user support. The application follows a data-first design philosophy inspired by Material Design 3, optimizing for quick scanning and efficient data entry. Users can organize expenses by year, month, and category while monitoring budget adherence through visual indicators.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type safety and component-based development
- Vite as the build tool for fast development and optimized production builds
- Client-side routing managed through state machine pattern in App.tsx (login → year overview → monthly overview → month detail → presets)

**UI Component System**
- shadcn/ui components built on Radix UI primitives for accessible, unstyled components
- Tailwind CSS for utility-first styling with custom design tokens
- Custom theme system supporting light/dark modes with CSS variable-based color tokens
- Component examples located in `client/src/components/examples/` for isolated development

**State Management**
- TanStack Query (React Query) for server state management with aggressive caching (staleTime: Infinity)
- Local React state for UI-specific concerns (dialogs, form inputs)
- Theme state persisted to localStorage

**Design System**
- Color-coded categories for visual expense grouping (Shopping: purple, Food: orange, Bills: cyan, Others: teal)
- Budget status indicators using semantic colors (success/warning/error)
- Responsive progress bars for budget visualization
- User avatars with deterministic color assignment based on first letter

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for REST API endpoints
- Middleware stack: JSON parsing, URL encoding, request logging with response capture
- Development-only Vite integration for HMR and SSR

**API Structure**
- RESTful endpoints organized by resource type:
  - `/api/users` - User management and authentication
  - `/api/users/:userId/years` - Year-level aggregations
  - `/api/years/:yearId/months` - Month-level data
  - `/api/months/:monthId/expenses` - Expense CRUD operations
  - `/api/categories`, `/api/subcategories`, `/api/payment-modes`, `/api/made-for` - Preset management

**Storage Layer**
- Repository pattern with IStorage interface abstracting database operations
- Drizzle ORM for type-safe database queries
- SQL schema with relationships: Users → Years → Months → Expenses, with Expenses referencing Categories, Subcategories, PaymentModes, and MadeForEntities
- Aggregation queries for calculating totals, budget progress, and top categories

**Data Model Philosophy**
- Hierarchical time-based organization: User → Year → Month → Expense
- Normalized design with separate tables for reusable presets (categories, payment modes, etc.)
- Optional budget tracking at year and month levels
- Exclude-from-budget flag for non-tracked expenses

### Authentication & Authorization

**Current Implementation**
- Session-based user selection (no passwords)
- Last login timestamp tracking
- Role-based field in users table (admin/standard) - not actively enforced in current implementation

### Build & Deployment

**Development**
- `npm run dev` - Runs Express server with Vite middleware for HMR
- TypeScript compilation checking via `npm run check`
- Database schema push via `npm run db:push`

**Production**
- Client build: Vite bundles React app to `dist/public`
- Server build: esbuild bundles Express server to `dist/index.js` with ESM format
- Separate build outputs allow for static asset serving + Node.js server deployment

## External Dependencies

### Database
- **Neon Serverless PostgreSQL** - Primary data store via `@neondatabase/serverless`
- WebSocket support for connection pooling
- Connection URL required via `DATABASE_URL` environment variable
- Drizzle Kit for schema migrations and synchronization

### UI Component Libraries
- **Radix UI** - Headless component primitives for accessibility (dialogs, dropdowns, selects, popovers, etc.)
- **Lucide React** - Icon library for consistent iconography
- **date-fns** - Date formatting and manipulation
- **cmdk** - Command palette component (imported but not visibly used in current codebase)

### Development Tools
- **Replit-specific plugins** - Runtime error modal, cartographer, dev banner for Replit environment
- **tsx** - TypeScript execution for development server
- WebSocket (`ws`) for Neon database connections

### Form Management
- **React Hook Form** - Form state management with validation
- **Zod** - Schema validation integrated with Drizzle via `drizzle-zod`
- `@hookform/resolvers` for Zod integration

### Styling
- **Tailwind CSS** with PostCSS and Autoprefixer
- **class-variance-authority** - Type-safe variant styling for components
- **clsx** and **tailwind-merge** - Conditional className composition