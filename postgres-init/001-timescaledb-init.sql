CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS timescaledb_toolkit;

DO $$
BEGIN
    RAISE NOTICE 'TimescaleDB extensions created successfully';
END $$;