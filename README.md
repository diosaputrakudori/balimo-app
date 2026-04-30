# Villa Management System

A maintainable and scalable Villa Management System built with a monolithic architecture. This application provides a robust backend and an intuitive frontend for managing villa bookings, preventing double bookings, and handling general availability.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **UI/Styling**: Tailwind CSS + shadcn/ui

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:
- Node.js (v18 or higher recommended)
- npm, yarn, pnpm, or bun
- PostgreSQL (running locally or accessible via URL)

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repository-url>
   cd <your-project-directory>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root of the project and add your database connection string:
   ```env
   # PostgreSQL Connection String
   DATABASE_URL="postgresql://<USER>:<PASSWORD>@localhost:5432/<DATABASE_NAME>?schema=public"
   ```

4. **Initialize Database Setup (Prisma)**:
   Generate the Prisma Client and sync your database schema:
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Push schema to the database
   npx prisma db push
   
   # Or alternatively, run migrations
   # npx prisma migrate dev --name init
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Core Features Implemented

- **Clean Architecture Principles**: Segregation between the UI (`components`, `app`), Business Logic (`services`), and Actions (`actions`).
- **Double Booking Prevention**: Robust server-side validation ensuring `(RequestedCheckIn < ExistingCheckOut) AND (RequestedCheckOut > ExistingCheckIn)` for booking collision.
- **Type-safe Validation**: Extensive use of Zod to validate form submissions and server payloads.
- **Prisma Integration**: Singleton instance set up to avoid connection leaks during Next.js Hot Module Replacement (HMR).

## Project Structure

```text
src/
├── actions/              # Server Actions (Business Logic entry points)
├── app/                  # Next.js Pages & Routing
├── components/           # UI Components (shadcn/ui, domain-specific)
├── lib/                  # Utilities (Prisma Client, tailwind utils, etc.)
├── schema/               # Zod Schemas for validations
└── services/             # Core Business Logic and Database Interactions
prisma/
└── schema.prisma         # Prisma ORM Database Schema
```
