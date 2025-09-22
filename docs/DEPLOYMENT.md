# Deployment Guide

## Replit Deployment

The application is configured for Replit hosting. To deploy:

1. Import the repository into Replit
2. Replit will automatically detect the project and configure it
3. Set the environment variables in the Replit Secrets tab:
   - `NODE_ENV`: production
   - `PORT`: 5000
   - `JWT_SECRET`: your-production-jwt-secret
   - `DATABASE_URL`: file:./prod.db
4. Click "Run" to deploy the application

## Manual Deployment

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

## Health Check

The application exposes a health check endpoint at `/api/health` that returns:
```json
{
  "status": "ok",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

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