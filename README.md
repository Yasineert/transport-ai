# Marrakech Transport System

A comprehensive transport management system built with Next.js for managing fleet operations, routes, maintenance, drivers, and bus stops.

## Project Structure

This project consists of:
- **Frontend**: Next.js application with React 19
- **Backend**: Expected to run separately on port 8081 (see API configuration in `lib/api.ts`)
- **Database**: SQL database with schema defined in `db/schema.sql`

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- pnpm (recommended) or npm
- PostgreSQL database server (for production)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/system-transport.git
   cd system-transport
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Backend Setup

The frontend expects a backend service running on `http://localhost:8081/api`. During development, the application falls back to mock data if the backend is not available.

To set up the backend (when available):
1. Set up a PostgreSQL database
2. Run the schema from `db/schema.sql`
3. Configure and start the backend API server

## Development Workflow

- **Main Branch**: Production-ready code
- **Development Branch**: Integration branch for features
- **Feature Branches**: Individual features (format: `feature/feature-name`)
- **Bugfix Branches**: Bug fixes (format: `bugfix/issue-description`)

## Testing

Run the test suite with:
```bash
pnpm test
```

## Deployment

The application is configured for continuous deployment through Azure DevOps.

## Project Structure

```
system-transport/
├── app/                   # Next.js app directory (routes)
├── components/            # React components
├── db/                    # Database schemas
├── hooks/                 # React hooks
├── lib/                   # Utilities and API client
├── public/                # Static assets
├── styles/                # Global styles and CSS modules
└── types/                 # TypeScript type definitions
```

## License

[Your License Here] 
