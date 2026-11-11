import pluginCypress from 'eslint-plugin-cypress'

export default [
  pluginCypress.configs.recommended,
  {
    files: ['cypress/**/*.js'],
    rules: {
      'cypress/no-unnecessary-waiting': 'error',
    },
  },
]
