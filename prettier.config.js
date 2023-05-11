/*
 * This file consists of Prettier overrides that will be enforeced by the
 * pre-commit hook and code editors.
 *
 * Most of the configurations mentioned here are either default prettier
 * configurations or borrowed from
 * Airbnb JavaScript Style Guide (https://github.com/airbnb/javascript)
 */
module.exports = {
    singleQuote: true,
    trailingComma: 'all',
    tabWidth: 2,
    useTabs: false,
    semi: true,
    arrowParens: 'always',
    bracketSpacing: true,
    endOfLine: 'lf',
    htmlWhitespaceSensitivity: 'css',
    jsxBracketSameLine: false,
    printWidth: 80,
  };