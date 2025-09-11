# Railway Deployment Guide

This guide covers deploying the Personal Trainer Planner to Railway as an
alternative to Vercel.

## Why Railway?

Railway provides a traditional Node.js server environment which offers:

- **No function timeouts** - Google Calendar sync can take as long as needed
- **Persistent server** - Better for long-running operations
- **Integrated PostgreSQL** - Database in the same network
- **Simple pricing** - $5/month per service

## Prerequisites

- GitHub account with repository access
- Railway account (sign up at [railway.app](https://railway.app))
- Environment variables ready (see below)

## Deployment Steps

### 1. Create New Project

1. Log in to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub
5. Select the `personal-trainer-planner` repository

### 2. Add PostgreSQL Database

1. In your Railway project, click "New Service"
2. Select "Database" → "Add PostgreSQL"
3. Railway will provide database connection strings:
   - Copy the **private URL** (with `railway.internal`)
   - Copy the **public URL** (without `railway.internal`)

### 3. Configure Environment Variables

Click on your app service, go to "Variables" tab, and add:

#### Required Variables

```bash
# Database (IMPORTANT: Set both!)
DATABASE_URL=your-private-url  # Use the private URL with railway.internal
DATABASE_URL_PUBLIC=your-public-url  # Use the public URL for migrations

# Authentication
NEXTAUTH_URL=https://${{RAILWAY_STATIC_URL}}
NEXTAUTH_SECRET=your-secret-here  # Generate with: openssl rand -base64 32

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
EMAIL_FROM=your-email@gmail.com

# Branding
PT_BRAND_NAME=Your Business Name
NEXT_PUBLIC_PT_FIRST_NAME=YourName
```

#### Optional Variables

```bash
# Google Calendar Integration
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
TIME_ZONE=Europe/London

# Contentful CMS
CONTENTFUL_SPACE_ID=your-space-id
CONTENTFUL_ACCESS_TOKEN=your-access-token
CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN=your-management-token

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

### 4. Deploy

1. Railway will automatically detect the `railway.toml` configuration
2. The first deployment will:

   - Install dependencies
   - Generate Prisma client
   - Build the Next.js application
   - Run database migrations at startup
   - Start the server

3. Monitor the deployment in the Railway dashboard
4. Once complete, click on the deployment to get your URL

**Note**: The deployment uses two database URLs:
- `DATABASE_URL` (private) - Used by the app at runtime for better performance
- `DATABASE_URL_PUBLIC` - Used only for migrations during deployment
This is because Railway's private network is only available at runtime.

### 5. Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain

## Key Differences from Vercel

### Database Migrations

- **Railway**: Migrations run automatically during build
- **Vercel**: Migrations run via GitHub Actions
- Both approaches are configured and will work correctly

### Function Timeouts

- **Railway**: No timeout limits for API routes
- **Vercel**: 10-second timeout (hobby), 60-second (pro)

### Build Commands

- **Railway**: Uses `railway.toml` configuration
- **Vercel**: Uses `vercel-build` script

### Environment Variables

- **Railway**: `RAILWAY_STATIC_URL` for the app URL
- **Vercel**: Automatically sets `VERCEL_URL`

## Google Calendar Sync Benefits on Railway

With Railway's persistent server, you can:

1. **Remove timeout protection** - Let sync operations complete naturally
2. **Process more appointments** - No 10-second limit
3. **Better error handling** - Can retry failed syncs immediately
4. **Add progress tracking** - Stream updates to the client

## Monitoring

### Logs

- View logs in Railway dashboard → Deployments → View Logs
- Or use Railway CLI: `railway logs`

### Database Access

```bash
# Connect to production database
railway run psql $DATABASE_URL

# Run Prisma Studio
railway run npx prisma studio
```

## Rollback

If needed, you can rollback to a previous deployment:

1. Go to Deployments tab
2. Find the previous working deployment
3. Click "Rollback to this deployment"

## Cost Estimation

- **Starter Plan**: $5/month (includes $5 of usage)
- **Typical usage**:
  - App service: ~$3-5/month
  - PostgreSQL: ~$2-3/month
  - Total: ~$5-8/month

## Troubleshooting

### Build Fails

- Check environment variables are set correctly
- Ensure `NODE_ENV=production` is set
- Review build logs for specific errors

### Database Connection Issues

- Railway automatically sets `DATABASE_URL`
- Ensure Prisma can connect: `railway run npx prisma db pull`

### Google Calendar Sync Issues

- Verify service account credentials
- Check that private key has proper newlines
- Ensure calendar is shared with service account

## Maintaining Vercel Compatibility

This setup maintains full compatibility with Vercel:

- The `railway.toml` file is ignored by Vercel
- The `vercel-build` script still works for Vercel deployments
- The start script works for both platforms
- No breaking changes to the codebase

You can deploy to both platforms simultaneously if needed for testing or
transition purposes.
