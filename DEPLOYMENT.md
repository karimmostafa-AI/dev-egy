# DEV Egypt E-commerce Platform - Deployment and Maintenance Guide

## Table of Contents
1. [System Overview](#system-overview)
2. [Prerequisites](#prerequisites)
3. [Local Development Setup](#local-development-setup)
4. [Deployment](#deployment)
5. [Environment Variables](#environment-variables)
6. [Database Management](#database-management)
7. [Maintenance Tasks](#maintenance-tasks)
8. [Monitoring and Logging](#monitoring-and-logging)
9. [Backup and Recovery](#backup-and-recovery)
10. [Troubleshooting](#troubleshooting)

## System Overview

The DEV Egypt e-commerce platform is a full-stack web application built with:
- **Frontend**: React (TypeScript), Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js with Express (TypeScript)
- **Database**: SQLite (managed via Drizzle ORM)
- **Deployment**: Configured for Replit hosting

### Architecture
```
client/          # Frontend React application
server/          # Backend Express API
shared/          # Shared code (database schemas)
attached_assets/ # Static assets
dist/            # Built application (generated during build)
```

## Prerequisites

Before deploying or maintaining the application, ensure you have:
- Node.js v18+ installed
- npm v8+ installed
- SQLite3 installed (usually comes with Node.js)
- Git for version control

## Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd dev-egypt
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   JWT_SECRET=your-jwt-secret-key
   DATABASE_URL=file:./dev.db
   ```

4. **Initialize the database**:
   ```bash
   npm run db:push
   ```

5. **Seed initial data** (optional):
   ```bash
   npm run db:seed
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## Deployment

### Replit Deployment

The application is configured for Replit hosting:

1. Import the repository into Replit
2. Replit will automatically detect the project and configure it
3. Set the environment variables in the Replit Secrets tab:
   - `NODE_ENV`: production
   - `JWT_SECRET`: your-production-jwt-secret
   - `DATABASE_URL`: file:./prod.db

4. Click "Run" to deploy the application

### Manual Deployment

For manual deployment to a server:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Copy the dist folder** to your server

3. **Install production dependencies** on the server:
   ```bash
   npm install --production
   ```

4. **Set environment variables** on the server:
   ```bash
   export NODE_ENV=production
   export PORT=5000
   export JWT_SECRET=your-production-jwt-secret
   export DATABASE_URL=file:./prod.db
   ```

5. **Start the production server**:
   ```bash
   npm start
   ```

## Environment Variables

### Required Variables
- `NODE_ENV`: Environment (development|production)
- `PORT`: Port to run the server on (default: 5000)
- `JWT_SECRET`: Secret key for JWT token signing
- `DATABASE_URL`: SQLite database URL (e.g., file:./dev.db)

### Optional Variables
- `STRIPE_SECRET_KEY`: Stripe API key for payment processing
- `GOOGLE_ANALYTICS_ID`: Google Analytics tracking ID

## Database Management

### Schema Migrations

To update the database schema:

1. Modify the schema in `shared/schema.ts`
2. Generate migration files:
   ```bash
   npm run db:generate
   ```
3. Apply migrations to the database:
   ```bash
   npm run db:migrate
   ```

### Seeding Data

To seed initial data:
```bash
npm run db:seed
```

### Backup Database

To backup the database:
```bash
cp dev.db dev.db.backup.$(date +%Y%m%d)
```

## Maintenance Tasks

### Regular Maintenance

1. **Update dependencies**:
   ```bash
   npm outdated
   npm update
   ```

2. **Check for security vulnerabilities**:
   ```bash
   npm audit
   npm audit fix
   ```

3. **Clean up old logs**:
   ```bash
   # Remove logs older than 30 days
   find logs/ -name "*.log" -mtime +30 -delete
   ```

4. **Database optimization**:
   ```bash
   # Vacuum SQLite database to reclaim space
   sqlite3 dev.db "VACUUM;"
   ```

### Monitoring Data Cleanup

1. **Clear old analytics data** (if using a separate analytics database):
   ```sql
   DELETE FROM analytics WHERE created_at < date('now', '-90 days');
   ```

## Monitoring and Logging

### Application Logs

Logs are output to stdout/stderr and can be viewed in:
- Replit: Through the Replit console
- Manual deployment: Through systemd journal or log files

### Health Checks

The application exposes a health check endpoint at `/api/health` that returns:
```json
{
  "status": "ok",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

### Performance Monitoring

Key metrics to monitor:
- Response times for API endpoints
- Database query performance
- Memory usage
- CPU usage

## Backup and Recovery

### Automated Backups

Set up a cron job for daily backups:
```bash
# Daily backup at 2 AM
0 2 * * * cp /path/to/dev.db /path/to/backups/dev.db.$(date +\%Y\%m\%d)
```

### Recovery Procedure

1. Stop the application server
2. Restore the database from backup:
   ```bash
   cp /path/to/backups/dev.db.backup /path/to/dev.db
   ```
3. Start the application server

## Troubleshooting

### Common Issues

1. **Application won't start**:
   - Check that all required environment variables are set
   - Verify the database file exists and is accessible
   - Check logs for specific error messages

2. **Database connection errors**:
   - Verify `DATABASE_URL` is correctly set
   - Ensure the database file has proper permissions
   - Check that SQLite is properly installed

3. **Authentication issues**:
   - Verify `JWT_SECRET` is set and consistent
   - Check that the user account exists in the database
   - Ensure the password is properly hashed

4. **Slow performance**:
   - Check database query performance
   - Optimize frequently accessed endpoints
   - Consider adding indexes to frequently queried database columns

### Debugging Steps

1. **Check logs**:
   ```bash
   tail -f logs/app.log
   ```

2. **Enable debug mode**:
   Set `DEBUG=*` in environment variables to see detailed logs

3. **Test database connectivity**:
   ```bash
   sqlite3 dev.db ".tables"
   ```

4. **Verify API endpoints**:
   ```bash
   curl http://localhost:5000/api/health
   ```

## Support

For support, contact the development team at:
- Email: support@devegypt.com
- Slack: #dev-egypt-support channel

## Version History

- v1.0.0: Initial release with core e-commerce functionality