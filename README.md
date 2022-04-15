# Network Devices Health Monitoring System
#### By _Team the Group_
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI/CD](https://github.com/Pyxsys/ttg-healthcheck/actions/workflows/integration.yml/badge.svg)](https://github.com/Pyxsys/ttg-healthcheck/actions/workflows/integration.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Pyxsys_ttg-healthcheck&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Pyxsys_ttg-healthcheck)
 
## Technologies Used
#### Webapp
* ReactJS
* NodeJS (Express Framework)
* MongoDB (Cloud Database)
#### Daemon
* [Python 3.0 (or newer)](https://www.python.org/downloads/)

## Project Requirements
#### Webapp
* [NodeJS (12 or above)](https://nodejs.org/en/download/)
* MongoDB Account
* LocalMongo DB instance must be active in order to push code to repo
#### Daemon
* [psutil 5.8.0 (or newer)](https://pypi.org/project/psutil/)
* [requests 2.26.0 (or newer)](https://pypi.org/project/requests/)
* [coverage 6.1.1 (or newer)](https://pypi.org/project/coverage)

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

## Tests

### Server Unit Tests
To run these tests, you'll need a MongoDB database on your local machine.

* If you want to download MongoDB locally, visit https://github.com/Pyxsys/ttg-healthcheck/wiki/How-To-Setup-Local-MongoDB for futher instructions.
* From your command line go into the server folder of the project and run `npm run test` or `npm run test:coverage` if you wish to see the coverage.

### Client Unit Tests
To run these tests, you'll need to use Cypress. It is already a part of our dev dependencies and only requires `npm install` in in the root directory. You will also need to have the application running locally. That can be done by running `npm run dev` in the root of the project. All the tests are found in `cypress -> integration -> front-end`.

* In the root of the project, run `npx cypress open` if you want to execute the tests manually or run `npx cypress run` if you desire to execute the tests headlessly in your terminal instead.
* From there, a Cypress GUI will open up. You can either run all the tests that are in the test folder by click run all or run individual test file by clicking on the file itself.

### Performance and Load Tests

To run these tests, you'll again need to use Cypress and Jmeter. It is already a part of our dev dependencies and only requires `npm install` in the root folder. You will also need to have the Front-End and Back-End running locally. That can be done by running `npm run dev` in the root folder. All the performance tests are found in `cypress -> integration -> end-to-end -> performance` . Load Tests can be found in loadTests folder.

* In the command line, run `npx cypress open` to get the gui where you can navigate to the exact tests you want. The tests can also be run via command line only by entering `npx cypress run` and all the tests will be run in order.

* In order to run JMeter you need to have JMeter installed on your computer. Once you start the application you can then open the JMeter files in the folder listend above. Then just press the run test button at the top of the program.

### Daemon Tests

* From you command line, go to the daemon folder of the project and run `coverage run --branch -m unittest -v`

### End-To-End Tests
To run these tests, you'll need to use Cypress. It is already a part of our dev dependencies and only requires `npm install` in the root directory. You will also need to have the application running locally. That can be done by running `npm run dev` in the root of the project. All the tests are found in `cypress -> integration -> end-to-end`.

* In the root of the project, run `npx cypress open` if you want to execute the tests manually or run `npx cypress run` if you desire to execute the tests headlessly in your terminal instead.
* From there, a Cypress GUI will open up. You can either run all the tests that are in the test folder by click run all or run individual test file by clicking on the file itself.

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

## Acceptance Test Videos
### Login
https://user-images.githubusercontent.com/21341750/153103328-bf7a50b5-7dbd-462e-8afa-69d51f3ca01e.mp4

### Logout
https://user-images.githubusercontent.com/21341750/153103337-4577a4a2-44bf-4e6f-9080-3a8c319add0b.mp4

### Register
https://user-images.githubusercontent.com/21341750/153103345-281d5191-9b55-491e-a29b-5451c8e40a84.mp4

### Dashboard
https://user-images.githubusercontent.com/21341750/163578162-0919c3a7-5233-447d-9baa-13667eb5cef0.mp4

### Devices 
https://user-images.githubusercontent.com/21341750/153103357-7583525e-3890-4ffb-b6b2-63b359ce7e23.mp4

### Device Details
https://user-images.githubusercontent.com/21341750/153103366-075d76c4-336a-4305-a642-ac86ac81a06e.mp4

### Analytics
https://user-images.githubusercontent.com/21341750/163578094-248dd30e-0cdc-4ac6-bbd3-43bdc755729c.mp4

