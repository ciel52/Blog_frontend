module.exports = {
  apps: [
    {
      name: 'NuxtDjangoApp',
      exec_mode: 'cluster',
      instances: 'max',
      script: '.output/server/index.mjs',
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
        NUXT_PUBLIC_API_BASE: 'http://localhost:8000'
      }
    }
  ]
} 