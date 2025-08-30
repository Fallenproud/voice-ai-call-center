module.exports = {
  apps: [
    {
      name: 'velora-frontend',
      cwd: './apps/frontend',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'http://localhost:3001',
        NEXT_PUBLIC_LICENSE_SERVER_URL: 'http://localhost:3002'
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    },
    {
      name: 'velora-backend',
      cwd: './apps/backend',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        DATABASE_URL: 'postgresql://velora:velora123@localhost:5432/velora_voice',
        REDIS_HOST: 'localhost',
        REDIS_PORT: 6379,
        JWT_SECRET: 'your-super-secret-jwt-key-change-in-production',
        LICENSE_SERVER_URL: 'http://localhost:3002',
        FRONTEND_URL: 'http://localhost:3000',
        PORT: 3001
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    },
    {
      name: 'velora-license-server',
      cwd: './apps/license-server',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        LICENSE_SERVER_PORT: 3002,
        LICENSE_DB_URL: 'postgresql://velora:velora123@localhost:5432/velora_licenses',
        ALLOWED_ORIGINS: 'http://localhost:3000,http://localhost:3001',
        LICENSE_SECRET: 'your-super-secret-license-key-change-in-production'
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
};