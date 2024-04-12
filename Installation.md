
## Installation

This document gives an overview of how to install a working version of AIChefBot to a local repository, as well as detailing the deployment process to [Vercel](https://vercel.com/).

### Contents
- [Local Install](#installation)
- [Environment Variables](#Environment_Variables)
- [Deployment](#Deployment)

<hr>

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

### Environment Variables

Before a working version of AIChefBot can be run in a local repository, one must acquire and set environment variables.

```touch .env```

See an example of the `.env` file [here](./.env_example)

### Getting your keys

#### 1. OpenAI

[Sign up to OpenAI](https://platform.openai.com/signup)

- Frmo the sidebar, find the **API Keys** section.
- Click **Create new secret key**
- Give your key a name
- Copy your key into `.env` and replace `YOUR_OPENAI_API_KEY` with your new API key.

From here, you'll have to manage your funds. From the sidebar, navigate to **usage**, and put some funds in your account to use our OpenAI's models to generate your own recipes and images.


#### 2. MongoDB Atlas

[Sign up to MongoDB Atlas](https://www.mongodb.com/atlas)

- Click **Create a deployment**
- Choose the cluster you'd like to use. The free version is **M0**.
- Give your cluster a name, such as **yourname_AIChefBot**.
- Copy your **Username** and **Password**, these will be used as your *administrator* values in your `.env_example` file.
- Copy your **Username** value in to the `.env` file and replace `YOUR_MONGODB_ATLAS_ADMIN_NAME`.
- Copy your **Password** value in to the `.env` file and replace `YOUR_MONGODB_ATLAS_PASSWORD`.
- Delete the **users** database, to be replaced by AIChefBot's **users** database.

#### 3. Cloudinary



#### 4. AWS Cognito

Here you will have access to the most recent version of the application. To make changes and contribute, see the [contributing](./CONTRIBUTING.md) document.

```bash
$ npm run dev
```

<br>

Navigate to `http://localhost:3000` in your chosen browser to experience the development version.

<hr>

### Deployment

...