module.exports = {
  apps: [
    {
      name: "koverapp-blitz",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
    {
      name: "koverapp-worker",
      script: "./dist/worker.js",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
}
