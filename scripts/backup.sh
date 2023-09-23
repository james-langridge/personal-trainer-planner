#!/bin/bash

backup() {
    local backup_dir
    backup_dir="backups"

    local backup_file
    backup_file="$backup_dir/dbbackup$(date +"%y%m%d")"

    # Check if backups directory exists; if not, create it
    if [[ ! -d "$backup_dir" ]]; then
        mkdir -p "$backup_dir"
    fi

    # Perform the database dump and handle potential errors
    if pg_dump -U postgres -h containers-us-west-204.railway.app -p 7058 -W -F t railway > "$backup_file"; then
        echo "Backup successful: $backup_file"
    else
        echo "Error during backup!" >&2
        exit 1
    fi
}

backup
