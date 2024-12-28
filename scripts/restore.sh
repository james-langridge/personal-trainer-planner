#!/bin/bash

# Usage: ./restore.sh <backup_file> [environment]
# Environment can be: local (default), railway

set -euo pipefail

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

if [ $# -lt 1 ]; then
    log "Error: Backup file not specified"
    echo "Usage: $0 <backup_file> [environment]"
    echo "Environments: local (default), railway"
    exit 1
fi

BACKUP_FILE=$1
ENV=${2:-local}

if [ ! -f "$BACKUP_FILE" ]; then
    log "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

case $ENV in
    local)
        ENV_FILE=".env.local"
        ;;
    railway)
        ENV_FILE=".env"
        read -p "⚠️  WARNING: You are about to restore to PRODUCTION. Are you sure? (type 'yes' to confirm): " confirmation
        if [ "$confirmation" != "yes" ]; then
            log "Restore cancelled"
            exit 1
        fi
        ;;
    *)
        log "Error: Unknown environment '$ENV'"
        echo "Supported environments: local, railway"
        exit 1
        ;;
esac

if [ ! -f "$ENV_FILE" ]; then
    log "Error: $ENV_FILE file not found"
    exit 1
fi

source "$ENV_FILE"

if [ -z "${DATABASE_URL:-}" ]; then
    log "Error: DATABASE_URL not found in $ENV_FILE"
    exit 1
fi

log "Starting restore to $ENV environment..."
log "Using backup file: $BACKUP_FILE"

if [[ "$BACKUP_FILE" == *.gz ]]; then
    log "Uncompressing and restoring..."
    pg_restore \
        --clean \
        --if-exists \
        --no-owner \
        --no-privileges \
        --no-acl \
        --exit-on-error \
        --use-list=<(pg_restore -l "$BACKUP_FILE" | grep -vE "EXTENSION timescaledb|COMMENT ON EXTENSION timescaledb|EXTENSION timescaledb_toolkit|_timescaledb_") \
        -d "$DATABASE_URL" \
        <(gunzip -c "$BACKUP_FILE")
else
    log "Restoring uncompressed backup..."
    pg_restore \
        --clean \
        --if-exists \
        --no-owner \
        --no-privileges \
        --no-acl \
        --exit-on-error \
        --use-list=<(pg_restore -l "$BACKUP_FILE" | grep -vE "EXTENSION timescaledb|COMMENT ON EXTENSION timescaledb|EXTENSION timescaledb_toolkit|_timescaledb_") \
        -d "$DATABASE_URL" \
fi

if [ ${PIPESTATUS[0]} -eq 0 ] && [ ${PIPESTATUS[1]} -eq 0 ]; then
    log "Restore completed successfully to $ENV environment"
else
    log "Error: Restore failed"
    exit 1
fi