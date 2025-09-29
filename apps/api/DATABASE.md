# Database Setup Guide

This guide explains how to set up PostgreSQL with Prisma for the Trench API.

## Prerequisites

1. PostgreSQL installed and running on localhost:5432
2. Node.js and npm installed

## Environment Variables

Make sure your `.env` file contains the following variables:

```env
DATABASE_URL="..."
JWT_SECRET="..."
RESEND_API_KEY="..."
```

## Database Setup

### 1. Create Database

First, create the PostgreSQL database:

```sql
CREATE DATABASE trench_db;
```

### 2. Run Database Migration

```bash
npm run db:push
```

This will create the database tables based on the Prisma schema.

### 3. Generate Prisma Client

```bash
npm run db:generate
```

This generates the TypeScript client for database operations.

### 4. Seed Database (Optional)

To populate the database with test data:

```bash
npm run db:seed
```

This creates test users:
- Email: `test@example.com`, Password: `password123`
- Email: `admin@example.com`, Password: `password456`

## Available Scripts

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with test data

## Database Schema

### Users Table
- `id` (String, Primary Key) - Auto-generated CUID
- `email` (String, Unique) - User's email address
- `name` (String) - User's display name
- `password` (String) - Hashed password
- `createdAt` (DateTime) - Account creation timestamp

### Password Reset Tokens Table
- `id` (String, Primary Key) - Auto-generated CUID
- `userId` (String, Foreign Key) - Reference to user
- `token` (String, Unique) - Reset token
- `expiresAt` (DateTime) - Token expiration
- `used` (Boolean) - Whether token has been used
