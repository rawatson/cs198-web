lair-queue
==========

[![Build Status](https://travis-ci.org/cs198/lair-queue.svg)](https://travis-ci.org/cs198/lair-queue)

TODO: add more information about the project, contributing, workflow...

This is the LaIR queue web app's implementation. It is a statically served frontend web application
written in [React](http://facebook.github.io/react/).

## Run dev server

Run this command (without the $):

```bash
$ npm start
```

Open your browser, go to `localhost:8000`. Voila!

## Check your build

This command runs the tests and linter:

```bash
$ npm run check
```

If it does, and you've written tests for your contributions, you should be good to open a PR!

### Run tests only

This runs all the tests in the test suite, using Jest:

```bash
$ npm test
```

### Run lint only

This runs a modified version of `jshint` to work with `.jsx` files:

```bash
$ npm run lint
```

## How to write tests

TODO: move to wiki

### Jest

The tests are written using the [Jest](https://facebook.github.io/jest/) testing framework. Jest
mocks out any `require()`'d dependencies automatically, so that you test your React components in
isolation. Otherwise, the structure and expectations available work similarly to any other BDD
testing framework, like Mocha or Cucumber.

### React.addons.TestUtils

To simulate interactions with React components, get familiar with [React's test
utilities](http://facebook.github.io/react/docs/test-utils.html). More detailed explanations will
be posted later as contributions ramp up.

## Happy contributing!
