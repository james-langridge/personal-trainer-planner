#!/bin/bash

set -euo pipefail

BACKUP_DIR="backups"
RETENTION_DAYS=30
DATE=$(date +"%y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/db_backup_${DATE}.tar.gz"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

if [ ! -f .env ]; then
    log "Error: .env file not found"
    exit 1
fi

set -a
source .env
set +a

if [ -z "${DATABASE_URL:-}" ]; then
    log "Error: DATABASE_URL not set in .env file"
    exit 1
fi

if [[ ! -d "$BACKUP_DIR" ]]; then
    mkdir -p "$BACKUP_DIR"
    log "Created backup directory: $BACKUP_DIR"
fi

log "Starting backup..."

TEMP_BACKUP_FILE="${BACKUP_FILE}.tmp"

if PGPASSWORD="${DATABASE_URL#*:*:}" \
   pg_dump "${DATABASE_URL}" \
   -Fc \
   --clean \
   --if-exists \
   --no-owner \
   --no-privileges \
   --disable-triggers > "${TEMP_BACKUP_FILE}"; then

    gzip -c "${TEMP_BACKUP_FILE}" > "${BACKUP_FILE}"
    rm "${TEMP_BACKUP_FILE}"

    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log "Backup successful: $BACKUP_FILE (Size: $BACKUP_SIZE)"
else
    log "Error: Backup failed!"
    rm -f "${TEMP_BACKUP_FILE}" "${BACKUP_FILE}"
    exit 1
fi

log "Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "db_backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

log "Backup process completed successfully"