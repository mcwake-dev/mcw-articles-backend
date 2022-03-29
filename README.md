# mcw-articles-backend

A PostgreSQL-based Article API using JWT authentication

# Hosting

A live version of this API is hosted on Heroku at [https://mcw-articles.backend.herokuapp.com](https://mcw-articles.backend.herokuapp.com)

# Summary

This service is a re-implementation of part of the Back End project completed as part of the Northcoders Coding Bootcamp. By separating each component into a set of composable services, I am able to demonstrate knowledge of service-oriented architecture and use of multiple backend services.

- Matthew C Wake, 2022

## Skills Demonstrated

- Node.js
- Promises and Async/Await
- TDD using Jest and Supertest
- Environment Management and Seeding
- Express Routing, Middleware and Error Handling
- Authentication using JWT
- MVC Architecture
- Interacting with a PostgreSQL database
- REST API
- CI/CD using Github Actions

# Setup

The instructions below will guide the reader in setting up a local development and testing environment for this API.

## Node.js

This API requires Node.js version 17.7.2+ - while other versions may work they have not been tested with this API. It is recommended for development purposes to install Node.js using [nvm](https://github.com/nvm-sh/nvm), as this allows for multiple versions of Node.js to exist simulatenously on the same system, and avoids permissions issues with certain NPM packages.

## PostgreSQL

This API requires an installation of PostgreSQL version 13+ for data storage and retrieval. On Ubuntu you can install PostgreSQL with the following command:

```
    sudo apt install postgresql
```

Once installed, enable autostart of the database with the following command:

```
    sudo systemctl enable postgresql
```

For ease of development, it is recommended to follow the instructions [here](https://www.postgresql.org/docs/9.3/libpq-pgpass.html) to create a .pgpass file which facilitates automatic login for the current user.

## Clone Repository

To clone this repo, use the following command:

```
    git clone https://github.com/mcwake-dev/mcw-articles-backend
```

## Install Dependencies

Dependencies can be installed using the following command in the project root once cloned.

```
    npm i
```

## Set Up Environment

The environment for this project is set up using JSON files. You will need to create the following file structure:

```
    [Project Root]
    env/
        - development.js
        - test.js
```

### Development

For development purposes env/development.js should contain the values below. Please refer to [ssh-keygen](https://www.ssh.com/academy/ssh/keygen) for details of how to generate a public/private key pair.

```
    process.env = {
        ...process.env,
        // An RSA Private Key
        JWT_PRIVATE_KEY: "-----BEGIN RSA PRIVATE KEY-----\n" +
                         ...
                         "-----END RSA PRIVATE KEY-----\n"
        // The corresponding RSA Public key
        JWT_PUBLIC_KEY: "-----BEGIN RSA PUBLIC KEY-----\n" +
                         ...
                         "-----END RSA PUBLIC KEY-----\n",
        // The issuer value for the JWT - this must match across
        // all used services and the authentication service
        JWT_ISSUER: "MCWake",
        // The name of the development database
        PGDATABASE: "mcw_articles",
        // The port for the development
        PORT: process.env.PORT || 9001
    }
```

### Testing

For testing purposes env/test.js should contain the following values:

```
    process.env = {
        ...process.env,
        // An RSA Private Key
        JWT_PRIVATE_KEY: "-----BEGIN RSA PRIVATE KEY-----\n" +
                         ...
                         "-----END RSA PRIVATE KEY-----\n"
        // The corresponding RSA Public key
        JWT_PUBLIC_KEY: "-----BEGIN RSA PUBLIC KEY-----\n" +
                         ...
                         "-----END RSA PUBLIC KEY-----\n",
        // The issuer value for the JWT - this must match across
        // all used services and the authentication service
        JWT_ISSUER: "MCWake",
        // The name of the testing database
        PGDATABASE: "mcw_articles_test",
        // The name of the platform which JWTs will be issued for
        JWT_AUDIENCE: "MCW Platform",
        // The expiration string for the JWT, eg 30d = 30 days
        JWT_EXPIRES: "30d",
        // The algorithm used to sign JWTs
        // This must be an RSA algorithm
        // i.e. HS256 would be invalid
        JWT_ALGORITHM: "RS256"
    }
```

## Seeding Database

### Creating DBs

In order to test and develop with this API, development and test datasets have been supplied. To create the required databases, or to revert changes, use the following command in the project root folder:

    npm run setup-dbs

This command will destroy and recreate the dev and test databases.

### Populating Tables

Once the databases exist, you can use the following command to populate the new databases with data for testing purposes.

    npm run seed

## Testing

To run all tests and ensure correct operation of the API, use the following command:

```
    npm test
```

## CI/CD

Should you wish to use the included Github Actions workflow to automate testing and deployment to [Heroku](https://dashboard.heroku.com/account), you will need to configure Secrets for all the keys above, as well as the following additional keys:

```
    HEROKU_API_KEY - Your api key from Heroku
    HEROKU_APP_NAME - Your unique app name on Heroku
    HEROKU_EMAIL_ADDRESS - Email address associated with your Heroku account
```

## Deployment

To complete deployment, add the Heroku Postgres addon to your app and configure the following keys in your Heroku app:

```
    // The RSA public key from your mcw-auth-backend app
    JWT_PUBLIC_KEY: "-----BEGIN RSA PUBLIC KEY-----\n" +
                        ...
                        "-----END RSA PUBLIC KEY-----\n",
    // The issuer value for the JWT - this must match across
    // all used services and the authentication service
    JWT_ISSUER: "MCWake",
    // The connection string for the live database
    DATABASE: "postgres://...",
    // The name of the platform which JWTs will be issued for
    JWT_AUDIENCE: "MCW Platform",
    // The expiration string for the JWT, eg 30d = 30 days
    JWT_EXPIRES: "30d",
    // The algorithm used to sign JWTs
    // This must be an RSA algorithm
    // i.e. HS256 would be invalid
    JWT_ALGORITHM: "RS256"
```
