module.exports = {
  exit: true,
  diff: true,
  bail: false,
  timeout: process.env.RESET_DATABASE ? 0 : 180000,
  reporter: 'mochawesome',
  ui: 'bdd',
  require: [
    'tsconfig-paths/register',
    'source-map-support/register',
    'mochawesome/register',
    (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') ?
      'dist/utility/helpers/testHelpers/hooks.js' :
      'dist/utility/helpers/testHelpers/hooks.js'
  ],
  spec: [
    (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') ?
      'src/api/v1/**/*.spec.ts' :
      'dist/api/v1/**/*.spec.js'

    // 'dist/api/v1/**/meeting.spec.js',
    // 'dist/api/v1/**/contact.spec.js',
    // 'dist/api/v1/**/breakoutRooms.spec.js',
    // 'dist/api/v1/**/ucl.project.spec.js',
  ],
};
