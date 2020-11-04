# Interview Scheduler

Scheduler is a single-page app built with React. It's intended to simulate an interview or appointment-scheduling app. The user can click through each day of the week and see which appointments are scheduled and when empty slots are available. Clicking on an empty slot, she can choose her interviewer from a list and book an appointment.

Users can also go back in and delete or edit appointments which have been booked.

What still missing from this app is a username/password system: for the moment, any user can edit any appointment.

What's also missing is a 'company' interface — an overview of the week, a schedule personalized for each interviewer, as well as the ability to define and edit schedule and interviewer data.

## Setup

This app runs on two servers, simulating a client and an API.

Install dependencies with `npm install`.

Fork and clone the [Scheduler API](https://github.com/lighthouse-labs/scheduler-api) and configure it according to the README. **This app will not run if you don't install the API first.**

## Running Webpack Development Server

With the API server running, open a separate terminal and boot up the app.

```sh
npm start
```

Then you're good to go! The homepage is pretty self-explanatory:

![root directory screenshot](url)

Click on one of the add buttons to access the appointment creation form.

![appointment form screenshot](url)

## Resetting the Database

To reset the API, make a get request on the API server to /api/debug/reset (modify the port in the below command if you're not running the API on port 8001)

```sh
curl http://localhost:8001/api/debug/reset
```

## Running Tests

Because this project was a learning excercise, there are two distinct testing frameworks in use. To test using jest, run `npm test` on the command line.

```sh
npm test
```

To test using cypress, you first need to create a test database. Follow the directions in the [Scheduler API](https://github.com/lighthouse-labs/scheduler-api) for database creation. Your new database should be named `scheduler_test`.

In the directory of the Scheduler API, switch to the test environment and reset the database from the command line.

```sh
NODE_ENV=test npm start
```

then in a separate terminal...

```sh
curl http://localhost:8001/api/debug/reset
```

Finally, start the client server

```sh
npm start
```

You're ready to run the cypress tests! In a third window...

```sh
npm run cypress
```

Select `navigation.spec.js` and you're ready to go!

## Running Storybook Visual Testbed

To explore the Storybook component development environment, run the `storybook` command in the client directory.

```sh
npm run storybook
```
