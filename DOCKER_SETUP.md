# Docker Setup Guide

Deploy Personal Trainer Planner anywhere using Docker - on your VPS, home
server, or cloud provider.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0+)
- An email account with SMTP access (Gmail, Outlook, or any email provider)

## Quick Start (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/james-langridge/personal-trainer-planner.git
cd personal-trainer-planner
```

### 2. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.docker.example .env

# Generate a secure secret key
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env
```

### 3. Configure Your Settings

Edit `.env` and fill in your details:

```env
# Required settings
PT_BRAND_NAME=Your Business Name
NEXT_PUBLIC_PT_FIRST_NAME=YourFirstName

# Email settings (see examples below)
SMTP_HOST=smtp.gmail.com         # Your email server
SMTP_PORT=587                    # Usually 587 or 465
SMTP_USER=your-email@example.com # Your email address
SMTP_PASSWORD=your-password      # Your email password
EMAIL_FROM=your-email@example.com # Sender address
```

#### Email Provider Examples:

**Gmail** (requires [app password](https://myaccount.google.com/apppasswords)):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yourname@gmail.com
SMTP_PASSWORD=xxxx-xxxx-xxxx-xxxx  # 16-character app password
```

**Outlook/Hotmail**:

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=yourname@outlook.com
SMTP_PASSWORD=your-password
```

**SendGrid** (recommended for production):

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey  # Literally "apikey"
SMTP_PASSWORD=SG.xxxx  # Your API key
```

**Local Development** (with MailHog):

```env
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=any@example.com
SMTP_PASSWORD=any
```

### 4. Start the Application

```bash
# Build and start the containers
docker-compose up -d

# Wait for database migrations (takes about 30 seconds)
docker-compose logs -f app
```

The app will be available at http://localhost:3000

### 5. Create Admin Account

```bash
# Option A: Use the seed script (for testing)
docker-compose exec app npx prisma db seed
# Default credentials: admin@example.com / test123

# Option B: Register and promote to admin
# 1. Register at http://localhost:3000/auth/signin
# 2. Run this SQL command:
docker-compose exec postgres psql -U postgres -d personal_trainer_planner -c "UPDATE \"User\" SET role = 'admin' WHERE email = 'your-email@gmail.com';"
```

## Production Deployment

### Using Docker on a VPS

1. **Set up your server:**

```bash
# Install Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

2. **Configure for production:**

```bash
# Edit .env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=$(openssl rand -base64 32)  # Generate new secret

# Use production database password
POSTGRES_PASSWORD=strong-password-here
```

3. **Set up SSL with Traefik (recommended):**

```yaml
# Add to docker-compose.yml
services:
  traefik:
    image: traefik:v2.10
    command:
      - '--providers.docker=true'
      - '--entrypoints.web.address=:80'
      - '--entrypoints.websecure.address=:443'
      - '--certificatesresolvers.letsencrypt.acme.email=your-email@gmail.com'
      - '--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json'
      - '--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web'
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./letsencrypt:/letsencrypt

  app:
    labels:
      - 'traefik.enable=true'
      - 'traefik.http.routers.app.rule=Host(`yourdomain.com`)'
      - 'traefik.http.routers.app.entrypoints=websecure'
      - 'traefik.http.routers.app.tls.certresolver=letsencrypt'
```

4. **Deploy:**

```bash
docker-compose up -d
```

### Single Docker Image (without PostgreSQL)

If you have an existing PostgreSQL database:

```bash
# Build the image
docker build -t personal-trainer-planner .

# Run with external database
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/dbname" \
  -e NEXTAUTH_SECRET="your-secret" \
  -e PT_BRAND_NAME="Your Business" \
  -e NEXT_PUBLIC_PT_FIRST_NAME="YourName" \
  -e SMTP_USER="your-email@gmail.com" \
  -e SMTP_PASSWORD="your-app-password" \
  -e EMAIL_FROM="your-email@gmail.com" \
  personal-trainer-planner
```

## Docker Commands Reference

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v

# Rebuild after code changes
docker-compose build app
docker-compose up -d

# Access app shell
docker-compose exec app sh

# Run Prisma commands
docker-compose exec app npx prisma studio
docker-compose exec app npx prisma migrate dev

# Database backup
docker-compose exec postgres pg_dump -U postgres personal_trainer_planner > backup.sql

# Database restore
docker-compose exec -T postgres psql -U postgres personal_trainer_planner < backup.sql
```

## Deployment Options

### Option 1: DigitalOcean Droplet

```bash
# Create a $6/month droplet with Docker pre-installed
# SSH in and follow the VPS instructions above
```

### Option 2: AWS EC2

```bash
# Launch t3.micro instance (free tier eligible)
# Install Docker and follow VPS instructions
```

### Option 3: Home Server

```bash
# Use docker-compose as-is
# Set up port forwarding on router (ports 80, 443)
# Consider using DuckDNS for free dynamic DNS
```

### Option 4: Synology NAS

1. Install Docker package from Package Center
2. Upload docker-compose.yml
3. Use Container Manager to deploy

## Environment Variables

### Required

- `NEXTAUTH_SECRET`: Random secret for JWT signing
- `PT_BRAND_NAME`: Your business name
- `NEXT_PUBLIC_PT_FIRST_NAME`: Your first name
- `SMTP_USER`: Gmail address
- `SMTP_PASSWORD`: Gmail app password
- `EMAIL_FROM`: Sender email address

### Optional

- `GOOGLE_CALENDAR_ID`: For calendar sync
- `CONTENTFUL_*`: For CMS features
- `SENTRY_DSN`: For error monitoring
- `TIME_ZONE`: Default is Europe/London

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs app

# Verify environment variables
docker-compose config

# Ensure database is ready
docker-compose ps
```

### Database connection issues

```bash
# Test database connection
docker-compose exec postgres psql -U postgres -d personal_trainer_planner

# Reset database
docker-compose down -v
docker-compose up -d
```

### Port already in use

```bash
# Change port in docker-compose.yml
ports:
  - "8080:3000"  # Use 8080 instead of 3000
```

### Permission issues

```bash
# Fix ownership
docker-compose exec app chown -R nextjs:nodejs /app
```

## Backup & Restore

### Automated Backups

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T postgres pg_dump -U postgres personal_trainer_planner > backups/backup_$DATE.sql
# Keep only last 7 days
find backups -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x backup.sh

# Add to crontab (daily at 2 AM)
echo "0 2 * * * /path/to/backup.sh" | crontab -
```

### Manual Backup/Restore

```bash
# Backup
mkdir -p backups
docker-compose exec postgres pg_dump -U postgres personal_trainer_planner > backups/backup_$(date +%Y%m%d).sql

# Restore
docker-compose exec -T postgres psql -U postgres personal_trainer_planner < backups/backup_20240101.sql
```

## Updating

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose build app
docker-compose up -d

# Run any new migrations
docker-compose exec app npx prisma migrate deploy
```

## Security Recommendations

1. **Use strong passwords** for database and admin account
2. **Enable firewall** (ufw or iptables)
3. **Set up SSL certificates** (use Traefik or nginx proxy)
4. **Regular backups** to external storage
5. **Keep Docker updated**
6. **Monitor logs** for suspicious activity
7. **Use Docker secrets** for sensitive data in production

## Performance Tuning

For better performance on limited resources:

```yaml
# In docker-compose.yml, add resource limits:
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Getting Help

- Check container logs: `docker-compose logs -f app`
- [GitHub Issues](https://github.com/james-langridge/personal-trainer-planner/issues)
- [Docker Documentation](https://docs.docker.com/)

## Next Steps

After deployment:

1. Add your clients in Users → Add User
2. Schedule appointments in Calendar
3. Set up service types and fees
4. Configure bootcamp classes
5. Test email notifications
