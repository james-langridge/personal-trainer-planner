# Staging Database Maintenance

## Overview

The staging/preview database is used for Vercel preview deployments from pull
requests. Migrations are automatically applied during the build process to
ensure PR previews work correctly.

## How It Works

1. **Preview Deployments**: The `vercel-build` script runs
   `prisma migrate deploy` before building
2. **Production Deployments**: GitHub Actions handles production migrations via
   `.github/workflows/deploy-migrations.yml`
3. **Database Separation**: Preview and production use different DATABASE_URL
   environment variables

## Potential Issues

Since PR preview migrations are applied to the staging database:

- Abandoned PRs leave migrations in the staging DB
- Updated PRs with changed migrations can cause conflicts
- The staging DB accumulates migrations that may never reach production

## Maintenance Schedule

The staging database should be reset periodically (recommended monthly) to clean
up orphaned migrations.

### Reset Process

1. **Export any test data you want to keep** (if applicable)

   ```bash
   npx prisma db pull
   ```

2. **Reset the staging database**

   ```bash
   # Connect to staging DB
   export DATABASE_URL="your-staging-database-url"

   # Reset and apply current main branch migrations
   npx prisma migrate reset --force
   ```

3. **Seed with test data** (optional)
   ```bash
   npx prisma db seed
   ```

## Best Practices

1. **Regular Resets**: Schedule monthly resets or after major PR merges
2. **Document Breaking Changes**: If a PR includes breaking migrations, note it
   in the PR description
3. **Test Data**: Keep seed scripts updated for quick staging environment
   restoration
4. **Monitor**: If preview deployments fail, check if staging DB needs reset

## Troubleshooting

### Preview deployment fails with migration error

- The staging DB may have conflicting migrations from other PRs
- Solution: Reset the staging database following the process above

### "Migration already applied" errors

- This is normal and safe - Prisma migrations are idempotent
- The migration was likely applied by a previous preview deployment

### Schema drift between staging and production

- This happens when abandoned PR migrations remain in staging
- Solution: Reset staging DB to match production schema
