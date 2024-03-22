# REST API

- [Introduction](#intro)
    - [Design assumptions](#design-assumptions)
- [Instructions](#instructions)
    - [Requirements](#requirements)
    - [Database](#database)
    - [Build](#build)
    - [Run](#run)
    - [Test](#test)
    - [API endpoints](#api-calls)
    - [Known Issues](#issues)

## <a id="intro">Introduction</a>

RESTful API using Node.js, Express, TypeScript, and an SQL database (preferably PostgreSQL).

### Design assumptions

1. Authentication is done via `Authorization Bearer Token`
2. The `Bearer Token` is set up on the `.env` file and can be a `string` of any length
3. The Tables `User, Post, Comment` are created once the application is started
4. Users, Posts and Comments dummy data are persisted once the application is started
5. The `MVC` design pattern is used

---

## Instructions

Download and unzip file from repository. Open in your IDE. Rename files `.env.example` and `docker.env.example`
to `.env` and `docker.env` respectively, and configure the properties.

The application runs different services as docker containers, so be sure to have __Docker__ installed globally on your
PC. See
instructions on how to install for [Mac](https://docs.docker.com/desktop/mac/install/)
and [Windows](https://docs.docker.com/desktop/windows/install/). _Docker-Compose_ is used to orchestrate the service's
containerization.

### <a id="requirements">Requirements</a>

- Node.js >= 16
- PostgresDB >= 15
- Docker >= 4.16.2

### <a id="database">Database</a>

The application uses Postgresql database. The database configuration properties are in the __.env__ and __docker.env__
files.

### <a id="build">Build</a>

To build the application as a docker image, open a terminal in the root directory of the application, then run the
command `COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose build`.

### <a id="run">Run</a>

To the run the application, open a terminal on the application root directory:

- To run app in local machine - run `yarn serve`
- To run app containers - run `docker-compose up`

### <a id="test">Test</a>

To run tests, simply run on terminal `yarn test`.

### <a id="api-calls">API endpoints</a>

The application endpoints are well documented with [Postman](https://www.postman.com) api client. To access the docs,
open
the
link e.g __https://documenter.getpostman.com/view/7307535/2sA358f6xk__ on your web browser.

