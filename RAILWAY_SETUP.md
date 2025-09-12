# Railway Quick Setup Guide

This guide helps you deploy Personal Trainer Planner on Railway in minutes.

## Prerequisites

You'll need:

- A [GitHub account](https://github.com)
- A [Gmail account](https://gmail.com) with 2-factor authentication enabled
- A [Railway account](https://railway.app) (free tier available)

## 1-Click Deploy

### Step 1: Deploy the App

Click this button to start:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/personal-trainer-planner)

### Step 2: Configure Required Variables

Railway will prompt you to fill in these required fields:

#### Business Information

- **PT_BRAND_NAME**: Your business name (e.g., "John's Fitness Training")
- **NEXT_PUBLIC_PT_FIRST_NAME**: Your first name

#### Email Settings (for password resets)

1. First, get a Gmail app password:

   - Go to
     [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Create a new app password named "Personal Trainer Planner"
   - Copy the 16-character password (remove spaces)

2. Fill in these fields:
   - **SMTP_USER**: Your Gmail address
   - **SMTP_PASSWORD**: The 16-character app password (no spaces)
   - **EMAIL_FROM**: Same as SMTP_USER

### Step 3: Deploy

Click "Deploy" and Railway will:

- Create a PostgreSQL database automatically
- Set up all database connections
- Generate security keys
- Deploy your application

Deployment takes about 3-5 minutes.

### Step 4: Create Your Admin Account

Once deployed, Railway will show your app URL. Visit it and:

1. Click "Sign In"
2. Click "Register"
3. Create your admin account with your email
4. Sign in with your new account

### Step 5: Set Admin Role

To make your account an admin:

1. In Railway dashboard, click on your postgres service
2. Click "Data" tab
3. Click "Query"
4. Run this SQL command (replace with your email):

```sql
UPDATE "User"
SET role = 'admin'
WHERE email = 'your-email@gmail.com';
```

That's it! You now have full admin access.

## Optional Enhancements

### Custom Domain

1. In Railway project settings, go to "Settings"
2. Add your custom domain
3. Update your DNS records as shown

### Google Calendar Sync

To sync appointments with Google Calendar:

1. Create a Google Cloud project
2. Enable Calendar API
3. Create a service account
4. Add these variables in Railway:
   - GOOGLE_CALENDAR_ID
   - GOOGLE_SERVICE_ACCOUNT_EMAIL
   - GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY

See [Google Calendar Setup Guide](docs/google-calendar-setup.md) for details.

### Environment Variables Reference

Railway automatically sets:

- **DATABASE_URL**: PostgreSQL connection
- **NEXTAUTH_SECRET**: Random secret for JWT
- **NEXTAUTH_URL**: Your app URL

Optional variables you can add later:

- **TIME_ZONE**: Your timezone (default: Europe/London)
- **SENTRY_DSN**: For error tracking
- **CONTENTFUL\_\***: For CMS features

## Troubleshooting

### Can't sign in?

- Check that you set the admin role in the database
- Verify your email is correct in the database

### Emails not sending?

- Ensure 2-factor authentication is enabled on Gmail
- Check app password has no spaces
- Try regenerating the app password

### Application errors?

- Check Railway logs: Dashboard → Your app → Logs
- Ensure all required environment variables are set
- Try redeploying: Dashboard → Your app → Settings → Redeploy

## Getting Help

- [GitHub Issues](https://github.com/james-langridge/personal-trainer-planner/issues)
- [Railway Discord](https://discord.gg/railway)
- [Documentation](https://github.com/james-langridge/personal-trainer-planner#readme)

## Next Steps

After setup:

1. Add your clients in Users → Add User
2. Schedule appointments in the Calendar
3. Configure service types and fees
4. Set up bootcamp classes if needed
5. Customize email templates

## Data Backup

Railway automatically backs up your database. For manual backups:

```bash
# In Railway dashboard, get your DATABASE_URL
# Then run locally:
pg_dump YOUR_DATABASE_URL > backup.sql
```

## Updating Your App

When updates are available:

1. Go to your GitHub fork
2. Sync with the upstream repository
3. Railway will automatically redeploy

Or manually trigger a redeploy in Railway dashboard.
