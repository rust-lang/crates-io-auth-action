# Contributing

Thank you for your interest in contributing to `crates-io-auth-action`!

For non-trivial contributions, please open an issue first to discuss your
proposed changes before submitting a pull request.

This action is primarily maintained by the Rust Infrastructure Team.
To chat with us, open a topic in the
[t-infra Zulip channel](https://rust-lang.zulipchat.com/#narrow/channel/242791-t-infra).

## Running the action

You can't run this action locally as it requires a GitHub environment.

## Install node dependencies

To install node dependencies, run:

```sh
npm install
```

### Packaging

The action code is located in `src/`.
After editing the code, run the following command to
compile the TypeScript code and its dependencies into a single file
in the `dist/` directory:

```sh
npm run package
```

This approach is inspired by the [typescript-action](https://github.com/actions/typescript-action)
repository and avoids committing the `node_modules` directory to the repository.

To keep these files from displaying in diffs by default or counting toward the repository language,
we added the `dist/` directory to the [`.gitattributes`](.gitattributes) file with the
`linguist-generated=true` attribute.
You can learn more about this in the
[GitHub docs](https://docs.github.com/en/repositories/working-with-files/managing-files/customizing-how-changed-files-appear-on-github).

#### Tree-shaking

Unfortunately, a bug in the `"@actions/core"` library prevents
[tree-shaking](https://rollupjs.org/introduction/#tree-shaking) to work.

This means that the `dist/` directory will contain more code than necessary
because the final javascript file will contain all the files imported, even
if we just import a few constants or functions.

This is why if we import something from `post.ts` in `main.ts` or vice versa,
the action will run both `main.ts` and `post.ts` code.
Therefore, it is important that `main.ts` and `post.ts` don't depend on each other.

This issue is tracked in [#5](https://github.com/rust-lang/crates-io-auth-action/issues/5).

### Formatting

We use [Prettier](https://prettier.io/) to format TypeScript, Markdown, and YAML files.
To format all files, run:

```sh
npx prettier --write .
```

### Linting

We use [ESLint](https://eslint.org/) for linting TypeScript files.

To check for linting errors, run:

```sh
npx eslint
```

### Testing

There are two types of tests running in [ci.yml](.github/workflows/ci.yml):

- `action-test`: Tests the action directly by running it against a mock server.
  You can't run this job locally as it requires a GitHub environment.
- `test`: Tests the JavaScript code by emulating a GitHub environment through
  environment variables and mocking the `@actions/core` library.
  To run these tests locally, run:

  ```sh
  npm run test
  ```

## Crates.io Documentation

To view the Crates.io OpenAPI documentation,
copy and paste `https://crates.io/api/openapi.json`
into the [Swagger](https://petstore.swagger.io/) bar at the top of the page.

## GitHub Documentation

Here are some useful links to the GitHub documentation:

- [Creating a JavaScript action](https://docs.github.com/en/actions/sharing-automations/creating-actions/creating-a-javascript-action)
- [OpenID Connect](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/about-security-hardening-with-openid-connect)

## FAQ

### Why TypeScript?

There are 3 types of GitHub Actions:

1. **Docker Actions**: Slower than other types because they require pulling a Docker image.
2. **Composite Actions**: Don't support [runs.post] for job cleanup after the action runs.
   We need this feature to revoke the token after job completion.
3. **JavaScript Actions**:
   - Faster than Docker Actions (no Docker image required).
   - Support [runs.post] for job cleanup, so that we can revoke the token.
   - Include GitHub's `@actions/core` library for easy output handling and error management.

We chose a JavaScript Action for these benefits and use TypeScript for type safety.

[runs.post]: https://docs.github.com/en/actions/sharing-automations/creating-actions/metadata-syntax-for-github-actions#runspost

### Why Node 20?

We use Node 20 because it's the latest Node version supported by GitHub Actions.
The Node version used by this action is specified in the `action.yml` file.
