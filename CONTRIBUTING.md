
## Contributing

Thanks for contributing! 😁 Here are some rules that will make your change to
markdown-fences fruitful.

### Rules

* Raise a ticket to the feature or bug can be discussed
* Pull requests are welcome, but must be accompanied by a ticket approved by the repo owner
* You are expected to add a unit test or two to cover the proposed changes.
* Please run the tests and make sure tests are all passing before submitting your pull request
* Do as the Romans do and stick with existing whitespace and formatting conventions (i.e., tabs instead of spaces, etc)
  * we have provided the following: `.editorconfig` and `.eslintrc`
  * Don't tamper with or change `.editorconfig` and `.eslintrc`
* Please consider adding an example under examples/ that demonstrates any new functionality

## Deployment Steps

These are notes for deploying to NPM. I used `npmrc` to manage my NPM identities
(`npm i npmrc -g` to install ). Then I created a new profile called `public` with
(`npmrc -c public`) and then switch to it with `npmrc public`.

* create a pull request from `dev` to `main`
* check out `main`
* `npm version patch -m "message here" or minor`
* `npm publish --access public`
* Then switch to `dev` branch
* And then merge `main` into `dev` and push `dev` to origin
