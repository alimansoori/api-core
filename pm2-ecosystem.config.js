module.exports = {
  apps: [
    {
      name: 'Back-end Staging 8081',
      script: './dist/index.js',
      watch: './dist',
      ignore_watch: [ '*.swo'],
      env: {
        NODE_ENV: 'staging',
        PORT: 8081,
      },
    },
  ],
};
