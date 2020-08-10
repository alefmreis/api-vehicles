# API Vehicles

**Version 1.0.0** - [Change log](CHANGELOG.md)

## <b> Introduction

This project is an MVP of an API that performs query actions in which several users can perform queries on vehicles, models and brands. However, these entities still need to be registered and updated and even deleted. Therefore, the project will have public endpoints (general queries only) and private endpoints that are for searching for a certain item, entries, updates and deletions.

#### Brands
  A brand have an Id and a Name where Id is auto increment and Name is required and unique.

#### Models
  A Model have an Id, a Name and a BrandId where Id is auto increment, the name is required and unique and the BrandId is a foreign key to Brands table and should be required.

#### Vehicles
  A Vehicle have an Id, Value, ModelId, YearModel and a Fuel ['Gasoline', 'Ethanol', 'Flex'] where Id is auto increment, all fields are required  and the  ModelId are foreign key to Models table respectively.


### Adopted Assumptions
- Timestamp fields (created_at, updated_at) have been added to each entity's table
- Soft delete instead delete bank column
- For the time being the vehicle's value entity is being registered as a string, due to the fact that it has the currency in front. For future updates, one more field will be used in the field entity for the currency type and then the value property will be of the float type
- As the business rule says, a vehicle has a model and the model has a brand. So it was considered that in the vehicle listing, each vehicle turns with a model object and inside the model object will come a brand object.
- Only query endpoints will be public, all others must use basic authorization


## Technologies Used

#### NodeJS
Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine. Thats enable to develop on server-side. To know more click [here](https://nodejs.org/en/about/)

#### Koa
Koa is a new web framework which aims to be a smaller, more expressive, and more robust foundation for web applications and APIs. To know more click [here](https://koajs.com/#introduction)

#### Sequelize
Sequelize is a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server.

To know more click [here](https://sequelize.org/master/)

#### PostgreSQL
PostgreSQL is a powerful, open source object-relational database system that uses and extends the SQL language combined with many features that safely store and scale the most complicated data workloads. To know more click [here](https://www.postgresql.org/about/)

#### Fluent Validator
Fluent validator that enables validation on multiple object parameters at once. To know more click [here](https://www.npmjs.com/package/fluent-validator)

#### Jest
Jest is a delightful JavaScript Testing Framework with a focus on simplicity. To know more click [here](https://jestjs.io/docs/en/getting-started)


## How to setup the Application

<b>Environment Variables</b>
```
  PORT = This field references the port on which the application will be listening
  ADMIN_USERNAME = This field references the username used for basic auth authentication of admin endpoints
  ADMIN_PASSWORD = This field references the password used for basic auth authentication of admin endpoints
  POSTGRES_DATABASE = Database in which the application that will connect
  POSTGRES_USERNAME = Username of the application that will connect with postgres
  POSTGRES_PASSWORD = Password of the application that will connect with postgres
  POSTGRES_HOST = Host where postgres is working
  POSTGRES_PORT = Port on which postgres is running
```

#### Docker

Go to the project folder and run the following command
```sh
docker-compose up
```

When using the docker you will upload a base postgres on port 5432 and application on port 3500

#### Local
Go to the project folder and run the following commands

```sh
# Install project dependencies

npm install
```

```sh
# Start application locally

npm run dev
```

Don't forget to configure your .env file at the root of the project. If you have any questions on how to configure your .env, take a look at the .env.sample file

## How to consume the API
  - After start an application you can access the swagger located on http://localhost:3500/swagger

  - If you not confortable with swagger, you can use the following postman link https://www.getpostman.com/collections/3891fe2062a60fce39dc to consume this API


## How to run the API tests

#### Docker

Open your command line and run the following command. Remember that if you are using the postgres container, you must have it running
```sh
 docker exec -it api-vehicles npm run test
```

#### Local

 Go to the project folder and run the following command

```sh
npm run test
```













