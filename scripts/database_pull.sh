#!/bin/bash

set -e

DUMP_FILENAME='./pg_dump.tar'

source "${HOME}/git/personal-trainer-planner/.env.production" || exit $?
echo '💾 Creating production dump'

export PGPASSWORD
pg_dump -U $PGUSER -h $PGHOST -p $PGPORT -F t $PGDATABASE > $DUMP_FILENAME

source "${HOME}/git/personal-trainer-planner/.env" || exit $?
echo '🎡 Loading dump on localhost'

export PGPASSWORD
dropdb $PGDATABASE -p $PGPORT -U $PGUSER -h $PGHOST || echo "⚠️ Could not drop database - it might not exist yet."
createdb $PGDATABASE -p $PGPORT -U $PGUSER -h $PGHOST
pg_restore -U $PGUSER -h $PGHOST -p $PGPORT -F t -d $PGDATABASE $DUMP_FILENAME

echo '✨ Success!'
