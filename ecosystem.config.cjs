module.exports = {
  apps: [
    {
      name: 'NuxtDjangoApp',
      exec_mode: 'cluster',
      instances: 'max',
      script: '.output/server/index.mjs',
      env: {
        PORT: 3000,
        HOST: '127.0.0.1',
        NODE_ENV: 'production'
      }
    }
  ]
} 