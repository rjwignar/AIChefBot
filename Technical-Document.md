# Technical Document

![Technical Document Header](https://github.com/rjwignar/AIChefBot/assets/97624401/79957b9e-83e2-4e6f-912e-1bf1f23c17f0)

## Overview

AIChefBot is an innovative web application designed to generate unique and creative recipes using OpenAI's language model. This document outlines the technical aspects of AIChefBot, including its architecture, technologies used in the frontend and backend, and various other system components.

## Table of Contents

- [Technical Document](#technical-document)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Guides](#guides)
  - [Architecture](#architecture)
    - [High-Level Architecture](#high-level-architecture)
    - [Data Flow Diagram](#data-flow-diagram)
  - [Frontend Technologies](#frontend-technologies)
  - [Backend Technologies](#backend-technologies)
    - [OpenAI API Integration](#openai-api-integration)
  - [System Diagrams](#system-diagrams)

## Guides

- [Installation Process](./Installation.md)
- [Contributing and Development](./CONTRIBUTING.md)

## Architecture

AIChefBot leverages a robust architecture designed to provide a seamless experience for users looking to generate recipes using artificial intelligence ([OpenAI](https://openai.com/product)). Below goes over the high level architecture that ensures efficient data flow and processing but also supports comprehensive API integration, allowing for extensible interactions.

### High-Level Architecture

**Client-Side**

The client-side is built with [Next.js](https://nextjs.org/) and interacts with backend via RESTful APIs. For frontend we're using [react-bootstrap](https://react-bootstrap.netlify.app/) as our main css framework with other custom styles.

**Server-Side**

The backend server is also powered by Next.js that handles API requests, integrates with OpenAI, and manages data using [mongoDB](https://www.mongodb.com/), [Cognito](https://aws.amazon.com/cognito/), and [Cloudinary](https://cloudinary.com/).

### Data Flow Diagram

This data flow diagram (DFD) maps the flow of information throughout the system:
![image](https://github.com/rjwignar/AIChefBot/assets/78163326/2491e472-c6d1-424b-a5f7-7c35718ba6e9)


## Frontend Technologies

Below outlines the key of technologies and libraries used in building the frontend application.

- **[Next.js](https://nextjs.org/)**: Framework for rendering pages on both server and client side.
- **[React](https://react.dev/)**: Used for building user interface components.
- **[React-Bootstrap](https://react-bootstrap.netlify.app/)**: Main CSS framework for rapid UI development.

## Backend Technologies

This section outlines the technologies and services utilized in the backend of AIChefBot to ensure easy data management, user authentication, and media storage. Each component listed below plays a crucial role in the system's overall functionality.

- **[Node.js](https://nodejs.org/en)**: The core of our server-side application, Node.js provides a powerful runtime environment.
- **[MongoDB](https://www.mongodb.com/atlas)**: We use MongoDB, a NoSQL database, to manage all dynamic data related to users and their interactions. This includes stored diets, saved recipes, and any other user-specific information.
- **[AWS Cognito](https://aws.amazon.com/pm/cognito/)**: User management is handled securely through AWS Cognito, which makes authentication and authorization easy. This includes managing sensitive user information such as email, passwords, and usernames.
- **[Cloudinary](https://cloudinary.com/)**: To handle the storage and retrieval of recipe images efficiently, we've used Cloudinary.
- **[OpenAI API](https://platform.openai.com/docs/introduction)**: We use [OpenAI](https://openai.com/)'s [text generation models](https://platform.openai.com/docs/guides/text-generation) (i.e. GPT-3.5) and [image generation models](https://platform.openai.com/docs/guides/images) (i.e. [DALL-E 2](https://openai.com/dall-e-2)) to generate recipes and recipe images.

### OpenAI API Integration

AIChefBot integrates with the [OpenAI API](https://platform.openai.com/docs/introduction), the main purpose of this project, to dynamically generate random recipes based on the users input. The integration process is meticulously designed to be intuitive and efficient, to ensure a seamless user experience.

**User Input Collection**

Initially, the application prompts the user to generate based on their preference, which includes ingredients, dietary restrictions, or other similar saved recipes.

**Recipe Generation**

Upon gathering the user's preferences, AIChefBot then utilizes the `gpt-3.5-turbo-1106` model from OpenAI to interpret the input and generate corresponding recipes. We made it so that the AI model should return the recipes in a structured JSON format, which inclues detailed ingredients, instructions, and steps. Furthermore, we're also using [DALL-E](https://openai.com/dall-e-2) to generate images for those recipes.


## System Diagrams

Below includes diagrams we've created when planning the project which should help explain the setup of the system.

**Login/Registration**

![Login And Registration](https://github.com/rjwignar/AIChefBot/assets/97624401/b2c1dfd9-a42b-4c72-9657-9735ba240086)

**Manage Account**

![Manage Account](https://github.com/rjwignar/AIChefBot/assets/97624401/6845a904-2579-4433-a98f-55a67e8a73bf)


**Manage Recipes**

![Manage Recipes](https://github.com/rjwignar/AIChefBot/assets/97624401/bdee0f82-3367-42fd-803b-e5926e627220)


**Generate Recipes**

![Generate Recipes](https://github.com/rjwignar/AIChefBot/assets/97624401/f62274a6-b9e5-4c7a-9963-7da440de532d)
