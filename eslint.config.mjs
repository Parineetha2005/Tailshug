import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';

export default [
  {
    ignores: ['dist/**/*', 'node_modules/**/*', '.cache_tailshug/**/*']
  },
  firebaseRulesPlugin.configs['flat/recommended']
];
