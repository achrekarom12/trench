# Trench API

A Fastify-based REST API for educational management system with role-based access control.

## Features

- **Authentication & Authorization**: JWT-based auth with RBAC (Student, Faculty, Admin)
- **User Management**: Complete user lifecycle with profiles and verification
- **Database**: PostgreSQL with Prisma ORM
- **API Documentation**: Swagger/OpenAPI integration
- **Security**: Password hashing, session management, audit logging

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and JWT secret
```

### Database Setup

```bash
# Create and migrate database
pnpm run db:push

# Generate Prisma client
pnpm run db:generate

# Seed with test data (optional)
pnpm run db:seed
```

### Development

```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build
pnpm start
```

## API Endpoints

- **Authentication**: `/api/v1/auth/*`
- **Users**: `/api/v1/user/*`
- **Students**: `/api/v1/students/*`
- **Faculty**: `/api/v1/faculty/*`
- **Admins**: `/api/v1/admins/*`
- **Health**: `/health`
- **Docs**: `/documentation` (Swagger UI)

## Database Scripts

```bash
pnpm run db:generate    # Generate Prisma client
pnpm run db:push        # Push schema to database
pnpm run db:migrate     # Run migrations
pnpm run db:studio      # Open Prisma Studio
pnpm run db:seed        # Seed test data
```

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/trench_db"
JWT_SECRET="your-jwt-secret"
RESEND_API_KEY="your-resend-api-key"
```

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Fastify
- **Database**: PostgreSQL + Prisma
- **Auth**: JWT + bcrypt
- **Docs**: Swagger/OpenAPI
- **Email**: Resend
