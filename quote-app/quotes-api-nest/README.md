# API's for Quotes App

## Prerequisties

- Make sure the docker is running with postgres.
- Create a new database named **quotes_app**.

## Install all the app dependencies using command

```cmd
npm install
```

OR

```cmd
npm i
```

- For environment variables check the **example.env.stage.dev** file and copy & paste the contents from the file into new file named **.env.stage.dev**
  - Edit the DB credentials as per your DB configuration.

## Running migration scripts

- Make sure before running the migrations build the project.

- Build the project

```cmd
npm run build
```

- Run migrations

```cmd
npm run migration:run
```

## Start the server

- Start in development mode

```cmd
npm run start:dev
```

## Swagger

- http://localhost:4000/api

## ES Linting

- All the files should follow the proper linting rules.
- To check if any linting error is present in file, install the ESLint extension in VS Code.

  1. Go to extensions tab.
  2. Search ESLint
  3. Install the one which is certified by Microsoft

- To fix some of the linting issues automatically use the following command:

```cmd
npm run lint
```

## Code coverage

- There should be unit tests written for the controller/service/repository.
- If the code coverage is less then 80%, you will not be able to commit the changes.

- To check the code coverage use the following command:

```cmd
npm run test:cov
```
