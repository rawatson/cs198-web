CS198 Web application
=====================

[![Build Status](https://travis-ci.org/cs198/cs198-web.svg)](https://travis-ci.org/cs198/cs198-web)

This is the CS198 web application. Currently, it contains functionality to run the new LaIR queue.

It is a statically served frontend web application written in
[React](http://facebook.github.io/react/).

## Setup your development environment

In order for the site to work properly you will need to also start the development server for
[the API](https://github.com/cs198/cs198-api). To do that,
[follow the instructions here](https://github.com/cs198/cs198-api/wiki/setup).

Then, in your terminal, `cd` into the `cs198-web/` directory after cloning this repository, and run
(without the $):

```bash
$ npm install -g gulp
$ npm install
```

This will install the Gulp tool, which is useful for running a number of useful commands below; and
the rest of the development dependencies you need to run the application locally.

## Run the dev server

You first need to run the development server for the API. To do that, follow the instructions
[in the API repo](https://github.com/cs198/cs198-api).

Once it's up and running, run this command:

```bash
$ gulp serve
```

Now you can view the site in your browser at `localhost:8080`, and any changes you make while the
server is running should appear in your browser after a page refresh. Neato!

## Run tests

This command builds your code, and runs the tests and linter:

```bash
$ gulp check
```

If it does, and you've written tests for your contributions, you should be good to open a PR!

### Run tests or lint only

```bash
$ gulp test # runs tests
$ gulp lint # runs lint
```

## Happy contributing!
