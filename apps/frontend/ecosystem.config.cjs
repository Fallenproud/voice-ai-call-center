module.exports = {
  apps: [
    {
      name: 'velora-frontend',
      script: 'npm',
      args: 'run dev -- --port 3000 --hostname 0.0.0.0',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'http://localhost:3001',
        NEXT_PUBLIC_LICENSE_SERVER_URL: 'http://localhost:3002'
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
};