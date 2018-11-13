module.exports = {
  rules: {
    'no-underscore-dangle' : 'off',
    'prefer-destructuring': ['error', { object: true, array: false }],
    'func-names' : 'off',
  },
  extends: 'airbnb-base',
  env: {
    node: true,
    es6: true,
    mocha: true,
  },
  root: true,
};
