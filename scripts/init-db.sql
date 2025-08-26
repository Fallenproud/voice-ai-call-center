-- Initialize databases for Velora Voice™

-- Create license database (main database is already created as default)
CREATE DATABASE velora_licenses;

-- Grant permissions to velora user (user is already created with privileges on velora_voice)
GRANT ALL PRIVILEGES ON DATABASE velora_licenses TO velora;