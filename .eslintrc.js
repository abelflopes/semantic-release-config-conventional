/** @type import("eslint").Linter.Config */
const config = {
  extends: "@abelflopes/eslint-config-tsr-pro",
  rules: {
    "unicorn/prevent-abbreviations": 1,
    "unicorn/prefer-module": 1,
    "no-template-curly-in-string": 1,
  },
};

module.exports = config;
