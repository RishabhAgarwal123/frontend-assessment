# DoseSpot Front End Interview Assessment

This repository contains the outline of a React front end web application and a backend server for creating APIs. Please review the problem statement below and feel free to ask any clarifying questions to the recruiter. When you are ready, clone this repo and send it to the recruiter after you complete the exercise.

This exercise is designed to be completed in 2-4 hours on average however it has no time limit. Feel free to spend as much time as you need designing and building a solution to satisfy the requirements. We recommend timeboxing the activity. Please treat it as if it were a new production system you were developing at work. We are looking for clean, readable, efficient, and maintainable code. Consider UI/UX, accessibility, and consider unit tests as you create your solution. When you finish, please send your code back to DoseSpot for us to review in advance of your interview day. You are not limited to any particular CSS framework, component libraries or packages. Please note we will not be able to evaluate code utilizing 3rd party addins, components, etc. that are behind a paywall.

Please be prepared to discuss your work with members of the engineering team during the interview.

## Problem statement

We would like to build a simple customer facing reponsive UI to view, delete, and update a set of application users. Each user id should be unique when a user is created. How you achieve this is up to you however you might consider a package like UUID https://github.com/uuidjs/uuid#readme or similar.

## Requirements

**The user of the application should be able to:**

- View a list of users
- Pop up a modal to add new user.
- Delete a user with a toast message to confirm delete
- Add a user with new UUID
- Update a user name and e-mail

_Optional_

- Sort
- Filter

**The application should**

- Work on desktop and mobile
- Conform to WCAG 2.1 AA standards

### User API spec

**The API should include:**

- GET `/users returns` `{ users: [ { array of user objects ]}`
- GET `/users/:id` returns a user object
- POST `/users` accepts `{ name: 'string', email: 'string'}` and returns `{ name: 'string', email: 'string', id: 'string'}`
- DELETE `/users/:id` returns `{ success: true/false }`
- PATCH `/users/:id` returns `{ }`

_Optional_

- Sort
- Filter

#### User Object

```
{
  id: "string",
  name: "string",
  email: "email"
}
```

### Unit Tests & Functional Tests - Optional

- Add unit tests
- Add functional tests

## Getting started

### Prerequisites

- [git](https://git-scm.com/downloads)
- [Node.js 18+](https://nodejs.org/en/download/)
- [NPM] (bundled with node.js)

### Optional Packages

Feel free to add any packages (e.g., @mui/material, @mantine/core) or CSS frameworks (e.g., tailwindcss) that you are comfortable working with that will help you complete the problem statement.

### Set Up

First install the dependencies for client and server using `$ npm install` in each folder.

Then run the client and server using by using `$ npm start` in each folder.

Start editing App.js in the client folder!
The development server will rebuild and deploy automatically.

Tests are scaffolded using [Jest](https://facebook.github.io/jest/docs/en/getting-started.html) and jsdom. Feel free to install other testing frameworks if desired. Run the tests.

`$ npm test`

### Extra Questions

- If the endpoint required authentication, how would you consider implementing this?
- What if we wanted the UI to update based on changes from the server?
