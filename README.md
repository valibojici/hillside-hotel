# Hillside Hotel

This a full-stack web app for a fictional hotel created with **MySQL, Express, NodeJS, React**. It’s a re-implementation of another college project but this time more organized and with different technologies.

### 🎯 Goal

The goal was single-page CRUD app that communicates with a backend through a GraphQL API and does something useful (making hotel reservations).

### 🔍 Why?

I made this to understand better how to do client-side rendering since the original project was done using server-side rendering in vanilla PHP.

### 📦 Backend

The backend is written in Javascript (should have used Typescript 😭): NodeJS with Express. I used [Sequelize](https://www.npmjs.com/package/sequelize) as ORM for working with MySQL and a simple GraphQL library [graphql-http](https://www.npmjs.com/package/graphql-http)

### 💻 Frontend

The frontend is done in React, nothing extra. I used [@apollo/client](https://www.npmjs.com/package/@apollo/client) to manage GraphQL operations and caching. For the looks of the web app I used [Bootstrap v5.3](https://getbootstrap.com/)

### 🚀 Run locally 

See the last below

## Demo

### Youtube 
🎦 [Youtube Link](https://youtu.be/aBYG77xBBF0)

### Screenshots

  <img src="https://github.com/valibojici/hillside-hotel/assets/68808448/cb497b67-8554-4283-9261-c9633c46dfbc" width=45% />
  <img src="https://github.com/valibojici/hillside-hotel/assets/68808448/7f2cc65e-9efc-48f3-9fa7-2e9c9af60c0e" width=45% />
  
  #### Admin
  
  <img src="https://github.com/valibojici/hillside-hotel/assets/68808448/b454ff68-0cf5-43a0-98b0-1546623870a1" width=50% />


# What I’ve learned (re-learned)

## 🌐 GraphQL

GraphQL is an alternative to REST APIs where a client can specify exactly what data it needs from an API

- [graphql-http](https://www.npmjs.com/package/graphql-http) made writing a GraphQL API  quite easy.
- defined the types for each resource used (reservations, users etc.) – this is done in `./api/src/graphql/types/`
- defined what can you do on client-side: query or mutate data – this is done in `./api/src/graphql/queries/` and `./api/src/graphql/mutations/`
- Usually, resolvers (the functions that complete the query/mutation) are in different subdirectories but I placed them in the same file as the query / mutation because it was easier and they are pretty short.

## 🗄️ MySQL & Sequelize

- already familiar with SQL from college and with Laravel’s Eloquent (the main ideas)
- define Sequelize models for each table in my DB, this is done in `./api/src/models/` (also helped me with validation since they have some built-in functions)
- created *migrations* to create / drop tables and *seeders* to put some dummy data into the database for a demo.
- refreshed my memory on sql isolation levels — it was important to not have 2 users who book the same room. I used *serializable* isolation level to do that.

## 🐳 Docker 

- containerized the web app:
    - backend | frontend | DB | StripeCLI (this is used so Webhooks run on localhost)
- learned to use docker-compose:
    - mounted host volume so the changes made to the code from host are synced
    - used ENV files for sensitive information
    - extended the base docker-compose.yml
    - health-check for mysql (wait for MySQL service to finish starting before starting the backend)

## 🔑 Authorization & Authentification

- done with JWT ([jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken))
- created some simple middleware for handling tokens: `./api/middleware/`
- passwords are hashed with [BCrypt](https://www.npmjs.com/package/bcryptjs)

## 💳 Stripe integration

- used a [Stripe](https://stripe.com/en-gb-ro) test account for fake payments (to complete a reservation)
- used [Stripe webhooks](https://stripe.com/docs/webhooks) to listen for checkout expiration and cancel the reservation (set the status in DB)
- manually expire the checkout sesssion if user cancels reservation (no returns for now, maybe in the future)

## 📧 Sending Emails

- used [nodemailer](https://www.npmjs.com/package/nodemailer) for sending emails (confirm email for signing up and sending the stripe checkout link)
- an email is sent to user when signing up to confirm the email address before continuing with the signup (choosing username/password)
    - The email contains a link with a JWT (that expires in 2h) as a query parameter which has the email so I can pass it to the backend
- an email is sent with the stripe checkout link when a reservation is created — this is because the user can go back from the checkout page (and i didn’t want to store the link in DB)

## 🖼️ UI

- learned to use some basic React hooks like useState and useEffect for managing state
- refreshed memory on some Bootstrap basics (no custom SCSS)

## 🚀 Apollo GraphQL Client

- used [Apollo Client](https://www.apollographql.com/docs/react/) (for React) for state management of graphql data
- learned to do queries and migrations (with variables), updating local cache

## 📷 Storing Images

- From admin side you can change which image is used for a room type
    - because I use graphql-http, I can send only basic things like strings / numbers
    - the images are encoded in Base64 on client side and sent to server as a string
    - on server side I decode the images and save them to a public folder


# Run Locally

1. You need a stripe account (for the test payments) and a gmail account to send emails (or other email provider). Contact me for demo secret keys if you dont want to create accounts.
2. `git clone https://github.com/valibojici/hillside-hotel.git`
3. You need to edit .env file: *./.env.example*
    - Rename env file:
        
        ```
        cp .env.example .env
        ```
        
    - You need to add stripe secret keys to *./.env* (**STRIPE_SECRET_KEY**, **STRIPE_WEBHOOK_KEY**) and email credentials (**EMAIL_USERNAME**, **EMAIL_PASSWORD**).
- Option 1: contact me for those
- Option 2: create a stripe account and add your secret key and webhook key (from [here](https://dashboard.stripe.com/test/webhooks/create?endpoint_location=local)) to `./.env` . Create a gmail account, add 2fa and generate an app password ([article here, at the end](https://edigleyssonsilva.medium.com/how-to-send-emails-securely-using-gmail-and-nodejs-eef757525324))
4. Run

```
docker-compose -f .\docker-compose.yml up
```

5. Wait for the services to start and go to http://localhost:8081/ (if you didn’t change the port) 
    1. Normal user/password: ************user/12345************ 
    2. Admin: **admin/admin**
