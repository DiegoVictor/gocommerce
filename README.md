# GoCommerce
![CircleCI](https://img.shields.io/circleci/build/github/DiegoVictor/gocommerce?style=flat-square&logo=circleci)
[![typescript](https://img.shields.io/badge/typescript-3.9.7-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![eslint](https://img.shields.io/badge/eslint-6.8.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![jest](https://img.shields.io/badge/jest-25.2.7-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/gocommerce?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/gocommerce)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/DiegoVictor/gocommerce/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=GoCommerce&uri=https%3A%2F%2Fraw.githubusercontent.com%2FDiegoVictor%2Fgocommerce%2Fmaster%2FInsomnia_2021-07-21.json)

Permit to register products and make orders. The app has rate limit, friendly errors, validation and also a simple versioning was made.

## Table of Contents
* [Installing](#installing)
  * [Configuring](#configuring)
    * [Postgres](#postgres)
      * [Migrations](#migrations)
    * [.env](#env)
* [Usage](#usage)
  * [Error Handling](#error-handling)
    * [Errors Reference](#errors-reference)
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
The application use just one database: [Postgres](https://www.postgresql.org/). For the fastest setup is recommended to use [docker](https://www.docker.com), see below how to setup ever database.

### Postgres
Responsible to store all application data. To create a postgres container:
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
In this file you may configure your Postgres database connection, JWT settings, the environment, app's port and a url to documentation (this will be returned with error responses, see [error section](#error-handling)). Rename the `.env.example` in the root directory to `.env` then just update with your settings.

|key|description|default
|---|---|---
|APP_PORT|Port number where the app will run.|`3333`
|NODE_ENV|App environment. The typeORM's database choice rely on this key value, so if the environment is `test` the database used will be `tests` otherwise the `POSTGRES_DATABASE` will set the database name.|`development`
|POSTGRES_HOST|Postgres host. For Windows users using Docker Toolbox maybe be necessary in your `.env` file set the host to `192.168.99.100` (docker machine IP) instead of localhost or `127.0.0.1`.|`127.0.0.1`
|POSTGRES_PORT|Postgres port.|`5432`
|POSTGRES_USER|Postgres user.| `postgres`
|POSTGRES_PASSWORD|Postgres password.| -
|POSTGRES_DATABASE|Application's database name.| gocommerce
|DOCS_URL|An url to docs where users can find more information about the app's internal code errors.|`https://github.com/DiegoVictor/gocommerce#errors-reference`

# Usage
To start up the app run:
```
$ yarn dev:server
```
Or:
```
npm run dev:server
```

## Error Handling
Instead of only throw a simple message and HTTP Status Code this API return friendly errors:
```json
{
  "status": "error",
  "message": "Too Many Requests",
  "code": 429,
  "docs": "https://github.com/DiegoVictor/gocommerce#errors-reference"
}
```
> As you can see a url to error docs are returned too. To configure this url update the `DOCS_URL` key from `.env` file.
> In the next sub section ([Errors Reference](#errors-reference)) you can see the errors `code` description.

### Errors Reference
|code|message|description
|---|---|---
|140|The email provided already in use|Already exists a customer with the same email.
|144|Customer not found|The `id` sent not references an existing customer in the database.
|240|There is not enough product quantity in stock|The requested quantity is not available in stock.
|244|Order not found|The `id` sent not references an existing order in the database.
|245|Customer not found|You are trying to create a new order with a customer that not exists.
|246|Product not found|This happens when you try to create a new order with a non existing product.
|247|Order not found|You are trying to retrieve products from a order that not exists.
|344|Product not found|The `id` sent not references an existing order in the database.
|349|A product with the same name already exists|Products must have unique names, but you provided one already in use.
|429|Too Many Requests|You reached at the requests limit.

## Versioning
A simple versioning was made. Just remember to set after the `host` the `/v1/` string to your requests.
```
GET http://localhost:3333/v1/orders/f4968587-5950-4df3-92d8-c5aee0c647c2
```

## Routes
|route|HTTP Method|params|description
|:---|:---:|:---:|:---
|`/customers`|POST|Body with customer `name` and `email`.|Create a new customer.
|`/customers/:id`|GET|`:id` of the customer.|Return one customer.
|`/products`|POST|Body with product `name`, `price` and `quantity`.|Create a new product.
|`/products/:id`|GET|`:id` of the product.|Return one product.
|`/orders`|POST|Body with order `customer_id` and `products` (with `id` and `quantity`).|Create a new order.
|`/orders/:id`|GET|`:id` of the order|Show one order.
|`/orders/:id/products`|GET|`:id` of the order|Return the products from an order.

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
