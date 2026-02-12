// ecosystem.config.cjs (use .cjs for CommonJS with "type": "module" in package.json)
// Phase 1: PM2 cluster for horizontal scaling on a single machine
// Note: Cron jobs run in each worker with cluster mode. Phase 2 (Redis + separate cron worker) addresses duplicate runs.

module.exports = {
  apps: [
    {
      name: 'wisestudent-api',
      script: 'server.js',
      instances: 'max',        // Use all CPU cores; use 2 or 4 for fixed count
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '500M',
      watch: false,
    },
  ],
};
