# Semantic Release Conventional

[**semantic-release**](https://github.com/semantic-release/semantic-release) shareable config to publish npm packages with [GitHub](https://github.com) using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) standard.

## Plugins

This shareable configuration uses the following plugins (with [internal configurations](https://github.com/abelflopes/semantic-release-config-conventional/blob/master/src/index.ts) applied):

- [`@semantic-release/commit-analyzer`](https://github.com/semantic-release/commit-analyzer)
- [`@semantic-release/release-notes-generator`](https://github.com/semantic-release/release-notes-generator)
- [`@semantic-release/changelog`](https://github.com/semantic-release/changelog)
- [`@semantic-release/npm`](https://github.com/semantic-release/npm)
- [`@semantic-release/github`](https://github.com/semantic-release/github)
- [`@semantic-release/git`](https://github.com/semantic-release/git)

## Installation

You can install this config via npm or yarn:

```bash
npm install semantic-release-config-conventional --save-dev
# or
yarn add semantic-release-config-conventional --dev
```

## Usage

The shareable config can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

To use this configuration in your project, create a Prettier configuration file
(e.g., .prettierrc.js) and extend `semantic-release-config-conventional`:

```js
// .releaserc.js

module.exports = {
    extends: "semantic-release-config-conventional"
};
```

### Configuration

This config can be provided with some options through environment variables

```js
// .releaserc.js

process.env.SR_CONFIG_NPM_PUBLISH = "false"; // if set to false will not attempt to publish a package to the registry
process.env.SR_CONFIG_NPM_PUSH = "true"; // if set to false will disable pushing of the package.json and changelog files after releasing
process.env.SR_CONFIG_CHANGELOG_FILE = "CHANGELOG.md"; // defines the path for the changelog file

module.exports = {
    extends: "semantic-release-config-conventional"
};
```

## Additional Recommended Setup

For optimal experience and consistency with sematic release, it is suggested to add commit validation matching the standard applied to semantic-release, in this case `conventional-commits`.

Ideally the releases should be performed through CI/CD workflows, reducing the possibility of human error. The commit validation should also run on the CI/CD workflows.

Check the [example/recipe](https://github.com/abelflopes/semantic-release-config-conventional/tree/master/docs/example).


## Configuration

See each [plugin](#plugins) documentation for required installation and configuration steps.

## Contributing

If you encounter any issues with this ESLint configuration or have suggestions for improvements,
please visit the GitHub repository and open an issue or pull request.
Check also the [development](./docs/DEVELOPMENT.md) docs.