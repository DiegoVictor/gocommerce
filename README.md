# GoCommerce
![CircleCI](https://img.shields.io/circleci/build/github/DiegoVictor/gocommerce?style=flat-square&logo=circleci)
[![eslint](https://img.shields.io/badge/eslint-6.8.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![jest](https://img.shields.io/badge/jest-25.2.7-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/gocommerce?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/gocommerce)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/DiegoVictor/gocommerce/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Be%20The%20Hero&uri=https%3A%2F%2Fraw.githubusercontent.com%2FDiegoVictor%2Fbethehero%2Fmaster%2Fapi%2FInsomnia_2020-05-01.json)

Permit to register products and make orders with it. The app has validation and a simple versioning was made.

## Table of Contents
* [Installing](#installing)
  * [Configuring](#configuring)
    * [Postgres](#ostgres)
      * [Migrations](#migrations)
    * [.env](#env)
* [Usage](#usage)
  * [Versioning](#versioning)
  * [Routes](#routes)
    * [Requests](#requests)
* [Running the tests](#running-the-tests)
  * [Coverage report](#coverage-report)

# Installing
Easy peasy lemon squeezy:
```
$ yarn
```
Or:
```
$ npm install
```
> Was installed and configured the [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) to keep the code clean and patterned.

## Configuring
The application use one database: [Postgres](https://www.postgresql.org/).

### Postgres
Responsible to store all application data. For the fastest setup is recommended to use [docker](https://www.docker.com), you can create a postgres container like so:
```
$ docker run --name gocommerce-postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```
> Then create two databases: `gocommerce` and `tests` (in case you would like to run the tests).

#### Migrations
Remember to run the database migrations:
```
$ yarn ts-node-dev ./node_modules/typeorm/cli.js migration:run
```
Or:
```
$ yarn typeorm migration:run
```
> See more information on [TypeORM Migrations](https://typeorm.io/#/migrations).

### .env
In this file you may configure your Postgres database connection, the environment and app's port. Rename the `.env.example` in the root directory to `.env` then just update with your settings.

|key|description|default
|---|---|---
|APP_PORT|Port number where the app will run.|`3333`

|NODE_ENV|App environment. The typeORM's database choice rely on this key value, so if the environment is `test` the database used will be `tests` otherwise the `POSTGRES_DATABASE` will set the database name.|`development`
|POSTGRES_HOST|Postgres host. For Windows users using Docker Toolbox maybe be necessary in your `.env` file set the host to `192.168.99.100` (docker machine IP) instead of localhost or `127.0.0.1`.|`127.0.0.1`
|POSTGRES_PORT|Postgres port.|`5432`
|POSTGRES_USER|Postgres user.| `postgres`
|POSTGRES_PASSWORD|Postgres password.| -
|POSTGRES_DATABASE|Application's database name.| gofinances

# Usage
To start up the app run:
```
$ yarn dev:server
```
Or:
```
npm run dev:server
```

## Versioning
A simple versioning was made. Just remember to set after the `host` the `/v1/` string to your requests.
```
GET http://localhost:3333/v1/orders/f4968587-5950-4df3-92d8-c5aee0c647c2
```

## Routes
|route|HTTP Method|params|description
|:---|:---:|:---:|:---:|:---:|:---:
|`/customers`|POST|Body with customer `name` and `email`.|Create a new customer.
|`/products`|POST|Body with product `name`, `price` and `quantity`.|Create a new product.
|`/orders`|POST|Body with order `customer_id` and `products` (with `id` and `quantity`).|Create a new order.
|`/orders/:id`|GET|`:id` of the order|Show one order.

### Requests
* `POST /customers`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@doe.com"
}
```

* `POST /products`

Request body:
```json
{
  "name": "Lemon",
  "price": 1.95,
  "quantity": 100
}
```

* `POST /orders`

Request body:
```json
{
  "customer_id": "d59d9a05-fba8-4e00-b3c4-11c0de51e410",
  "products": [
    {
      "id": "732b09e3-bb0c-40e9-b9dc-49616c907726",
      "quantity": 1
    },
    {
      "id": "56d4b719-058c-4ddd-a89b-b09dcb70e5d9",
      "quantity": 3
    }
  ]
}
```

# Running the tests
[Jest](https://jestjs.io/) was the choice to test the app, to run:
```
$ yarn test
```
Or:
```
$ npm run test
```

## Coverage report
You can see the coverage report inside `tests/coverage`. They are automatically created after the tests run.
