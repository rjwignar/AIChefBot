
## Installation

This document gives an overview of how to install a working version of AIChefBot to a local repository, as well as detailing the deployment process to [Vercel](https://vercel.com/).

### Contents
- [Local Install](#installation)
- [Environment Variables](#Environment_Variables)
- [Deployment](#Deployment)

### Installation

Set up a local development repository, clone the source repository via SSH.

```bash 
$ git clone git@github.com:rjwignar/AIChefBot.git
```

Navigate to the source directory.

```bash
$ cd AIChefBot
```

Install packages using NPM (this may take a minute).
```
$ npm install
```

#### Environment Variables

Before a working version of AIChefBot can be run in a local repository, one must acquire and set environment variables.

```touch .env```

See an example of the `.env` file [here](./.env_example)

Here you will have access to the most recent version of the application. To make changes and contribute, see the [contributing](./CONTRIBUTING.md) document.

```bash
$ npm run dev
```

<br>

Navigate to `http://localhost:3000` in your chosen browser to experience the development version.

<hr>

### Deployment

...