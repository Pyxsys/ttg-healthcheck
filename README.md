# Network Devices Health Monitoring System
#### By _Team the Group_
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI/CD](https://github.com/Pyxsys/ttg-healthcheck/actions/workflows/integration.yml/badge.svg)](https://github.com/Pyxsys/ttg-healthcheck/actions/workflows/integration.yml)
 
## Technologies Used
* ReactJS
* NodeJS (Express Framework)
* MongoDB (Cloud Database)
* ... 

## Project Requirements
* [NodeJS (12 or above)](https://nodejs.org/en/download/)
* MongoDB Account
* LocalMongo DB instance must be active in order to push code to repo

## Installation
Before starting the installation process, ensure that your computer has all the requirements listed above.

* Start off by cloning/Downloading the project 
* In the root folder of the project, install root dependencies by running `npm install`.
* Then, install all the required dependencies for the project by running `npm run install-all-deps`.

## Running
### Server and Client
* To run the server and client concurrently, run `npm run dev` in the root folder. 

### Server
* If you want to only run the server, run `npm run start` in the server folder.

### Client
* If you want to only run the client web application, run `npm run start` in the client folder.

## Unit Tests

### Server Tests
To run these tests, you'll need a MongoDB database on your local machine.

* Visit https://www.mongodb.com/try/download/community to download the Mongo-DB community server.
* After installation: C:\ -> program files -> mongoDB -> Server -> 5.0 -> Bin and launch mongod.
* From your command line go into the server folder of the project and run `npm run test` or `npm run test:coverage` if you wish to see the coverage.

### Client Tests

* From your command line go into the client folder of the project and run `npm run test` or `npm run test:coverage` if you wish to see the coverage.

### All Tests

* If you want to run all the test from the root of the project by running `npm run all-test` or `npm run all-test:coverage` if you wish to see the coverage.

## Coding Convention
To enforce the coding style of the project, we have integrated eslint and prettier in our project. You can use the following command to format the code to our coding covention: `npm run all-lint:fix` from the root of the project. In addition, we have integrated a script that will check the code prior to committing the code to ensure we maintain the correct standard.

We are using the following rules for our coding covention:
* [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
* [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
* Spaces for indentation, space width of 2.

## Contributors
* Derek Ruiz-Cigana
* Pierre-Alexis Barras
* Nathan Ziri
* Shashank Patel
* Sacha Elkaim
* Adam Richard
* Ashraf Khalil
* James El Tayar
* Michael Takenaka
