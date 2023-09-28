/**
 * Semantic Release setup
 * NOTE: cli flags will override configurations specified on this file
 * https://semantic-release.gitbook.io/semantic-release/
 *
 * This is a custom semantic release configuration, extends plugins to push to git and has some
 * environment based configurations relying on GH Actions environment variables
 *
 * Customizations differing from a standard config:
 * - dry run - dry run disables some plugins, and is allowed to run on any branch in a CI environment
 * - commit analyzer is running with conventional commits and chore and refactor changes trigger a patch version increase
 * - customized sections of release notes
 * - publish to npm when not in dry run and if npm publish flag is enabled, otherwise will just crate a release
 * - creates a github release when in CI and not in dry run
 * - pushes package & changelog changes to git when not in dry run and when push option is set
 */

import type { GlobalConfig, PluginSpec } from "semantic-release";

const env = {
  npmPublish: process.env.SR_CONFIG_NPM_PUBLISH,
  push: process.env.SR_CONFIG_NPM_PUSH,
  changelogFile: process.env.SR_CONFIG_CHANGELOG_FILE,
};

const cliArguments = process.argv.slice(2).map((item) => item.split("-").join("").toLowerCase());

const customOptions = {
  // Set to true if running on ci environment - allow publishing GitHub releases
  // https://semantic-release.gitbook.io/semantic-release/usage/configuration#ci
  // process.env.CI is injected by GH Actions - https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables
  // ci checks are disabled for dry run so that it is allowed to run on pull requests
  ci: Boolean(process.env.CI) && process.env.CI !== "false",
  // If set to true will prevent:
  // - package publish
  // - tag creation
  // - pushing to remote
  dryRun: cliArguments.includes("dryrun") || false,
  // If to tot true will publish package to registry
  npmPublish: env.npmPublish === undefined ? true : env.npmPublish === "true",
  // If set to true, will push version & changelog changes to remote
  push: env.push === undefined ? true : env.npmPublish === "true",
  // Path for changelog file
  changelogFile: env.changelogFile ?? "CHANGELOG.md",
};

/**
 * Semantic release configuration object
 * https://semantic-release.gitbook.io/semantic-release/usage/configuration
 */

const config: Partial<GlobalConfig> = {
  // https://semantic-release.gitbook.io/semantic-release/usage/configuration#tagformat
  tagFormat: "v${version}",
  // https://semantic-release.gitbook.io/semantic-release/usage/configuration#extends
  // https://semantic-release.gitbook.io/semantic-release/usage/workflow-configuration#workflow-configuration
  /**
   * sync with release workflow config
   * @see {@link file://./.github/workflows/release.yml}
   */
  branches: [
    // In case of dry run, allow any branch
    customOptions.dryRun
      ? "**"
      : {
          name: "master",
          prerelease: false,
          channel: false,
        },
  ],
  // https://semantic-release.gitbook.io/semantic-release/usage/configuration#ci
  ci: customOptions.ci,
  // https://semantic-release.gitbook.io/semantic-release/usage/configuration#dryrun
  dryRun: customOptions.dryRun,
  plugins: (() => {
    const plugins: PluginSpec[] = [
      // Defines versioning effects commits cause
      // https://github.com/semantic-release/commit-analyzer
      [
        "@semantic-release/commit-analyzer",
        {
          // Sync with commit convention tools
          // https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-conventionalcommits
          preset: "conventionalcommits",
          releaseRules: [
            /**
             * Prevent docs, chore and refactor(docs) typed / scoped commits
             * from affecting versions
             * https://github.com/semantic-release/commit-analyzer#releaserules
             * Defaults (when unmatched)
             * https://github.com/semantic-release/commit-analyzer/blob/master/lib/default-release-rules.js
             */
            { type: "refactor", release: "patch" },
            { type: "style", release: "patch" },
          ],
        },
      ],
      // Defined how the changelog content (release notes) is structured & generated
      // https://github.com/semantic-release/release-notes-generator
      [
        "@semantic-release/release-notes-generator",
        {
          preset: "conventionalCommits", // NOTE: should be synced with lerna config
          presetConfig: {
            // https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.0.0/README.md#types
            types: [
              {
                type: "feat",
                section: "Features",
                hidden: false,
              },
              {
                type: "fix",
                section: "Bug Fixes",
                hidden: false,
              },
              {
                type: "perf",
                section: "Performance",
                hidden: false,
              },
              {
                type: "refactor",
                section: "Code Refactoring",
                hidden: false,
              },
              {
                type: "revert",
                section: "Changes Reverted",
                hidden: false,
              },
              { type: "docs", hidden: true },
              { type: "test", hidden: true },
              { type: "style", hidden: true },
              { type: "chore", hidden: true },
            ],
          },
        },
      ],
      // Create/update changelog file
      // https://github.com/semantic-release/changelog
      [
        "@semantic-release/changelog",
        {
          changelogFile: customOptions.changelogFile,
        },
      ],
    ];

    // Publish in npm registry
    // https://github.com/semantic-release/npm
    if (!customOptions.dryRun) {
      plugins.push([
        "@semantic-release/npm",
        {
          npmPublish: customOptions.npmPublish,
        },
      ]);
    }

    // Create GitHub release
    // https://github.com/semantic-release/github
    if (!customOptions.dryRun && customOptions.ci) {
      plugins.push([
        "@semantic-release/github",
        {
          successComment: false,
          failComment: false,
        },
      ]);
    }

    // Push changes to remote
    // https://github.com/semantic-release/git
    if (!customOptions.dryRun && customOptions.push) {
      plugins.push([
        "@semantic-release/git",
        {
          assets: ["package.json", customOptions.changelogFile],
          message: "chore(release): publish [no ci]",
        },
      ]);
    }

    return plugins;
  })(),
};

module.exports = config;

export default config;
