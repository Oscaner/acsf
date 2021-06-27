module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: "babel-eslint",
  parserOptions: {
    sourceType: 'module', // Allows for the use of imports
    ecmaVersion: 2018,  // support aysnc/await
    ecmaFeatures: {
      modules: true,
    }
  },
  globals: {
    "document": "readonly",
  },
  rules: {
    "max-len": ["error", { "code": 120, "ignoreStrings": true }],
    // Disable Strict Mode on Global code
    "strict": ["off", "global"],
    // Use stroustrup brace style
    "brace-style": ["error", "stroustrup"],
    // @see https://eslint.org/docs/rules/no-use-before-define
    "no-use-before-define": ["error", { "functions": true, "classes": true, "variables": false }],
    // @see https://eslint.org/docs/rules/no-console
    "no-console": ["error", { allow: ["info", "error", "warn", "log"] }],
    // @see https://eslint.org/docs/rules/arrow-body-style
    "arrow-body-style": ["error", "always"],
    // @see https://eslint.org/docs/rules/object-shorthand
    "object-shorthand": ["error", "never"],
    // @see https://eslint.org/docs/rules/prefer-template
    "prefer-template": "off",
    // @see https://eslint.org/docs/rules/prefer-destructuring
    "prefer-destructuring": "off",
    // @see https://github.com/benmosher/eslint-plugin-import/blob/v2.20.2/docs/rules/no-unresolved.md
    "import/no-unresolved": ["error", { ignore: ['mamamia-lib'] }],
    // @see https://github.com/mysticatea/eslint-plugin-node/blob/v7.0.1/docs/rules/no-missing-require.md
    "node/no-missing-require": ["error", { "allowModules": ["mamamia-lib"] }],
    // @see https://github.com/benmosher/eslint-plugin-import/blob/v2.20.2/docs/rules/no-extraneous-dependencies.md
    "import/no-extraneous-dependencies": "off",
    // @see https://github.com/mysticatea/eslint-plugin-node/blob/v7.0.1/docs/rules/no-extraneous-require.md
    "node/no-extraneous-require": ["error", { "allowModules": ["mamamia-lib"] }],
    // @see https://eslint.org/docs/rules/no-plusplus
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    // @see https://eslint.org/docs/rules/class-methods-use-this
    "class-methods-use-this": "off",
    // @see https://eslint.org/docs/rules/no-await-in-loop
    "no-await-in-loop": "off",
    // @see https://eslint.org/docs/rules/no-restricted-syntax
    "no-restricted-syntax": "off",
  },
};
