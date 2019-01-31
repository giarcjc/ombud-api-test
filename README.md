# Ombud Technical Test 2019

# Current Status: v.0.0.1

## Currently Working:
    * Dockerized api (node/express), (spins up at http://localhost:3000)
    * Dockerized Database (Elasticsearch, currently only 1 shard)
    * Scripts to fetch, parse, load and enable csv data into DB
    * API routes that allow collection of documents to answer test questions (see API docs: `https://github.com/growombud/christopher-craig-test/blob/master/api-docs.md`)
    * A frontend container that spins up, HTML stub implementation (http://localhost:8080/) (UI not implemented).
    * 62 Unit Tests (so far) with coverage report

## Usage:
  - Spin up the stack: `docker-compose up`
  - (optional) status check: `http://localhost:3000/api/v1/status`
  - (optional) DB status check: `http://localhost:3000/api/v1/status/db`
  - (optional) View DB indicies: `http://localhost:9200/_cat/indices?v&pretty`
  - Pull, parse and load CSV files: `docker exec cctest-api "node" "server/db/parse-data.js"`
  - Enable fielddata on certain fields*: `docker exec cctest-api "node" "server/db/enable-field-data.js"`
  - To run unit tests:
    * locally in the project: `npm i` then `npm run test`
    * in the container: `docker exec -it cctest-api bash` then `npm run test`

   \* I know this is not necessarily best practice.  I'm still pretty new to Elasticsearch and this was my initial solution but future versions of the API might implement query/aggregation differently and make this step unnecessary.

## API Endpoints Implemented To Answer the Following Questions:
-Question:
**What product has the most complaints in the State of New York?**

- endpoint: `http://localhost:3000/api/v1/complaints/products?state=NY&limit=1`
        *Description:  gets document count of products in state (e.g. NY)*

-Question:
 **What is the aggregate population change between 2014 and 2015 in each state where Bank of America received a consumer complaint?**

- endpoint 1: `http://localhost:3000/api/v1/population/growth?fromYear=2014&toYear=2015`
        - Description: Gets the difference in population between fromYear (e.g. 2014) and toYear (e.g 2015) for all states.
- endpoint 2: `http://localhost:3000/api/v1/complaints/states?company=Bank of America`
        - *Description: Gets all states where Company X (e.g. BofA) had a complaint.*

-Question: **What is the fastest growing state that also has the most complaints for payday loans?**

- endpoint 1: `http://localhost:3000/api/v1/population/growth?rate=true`
        *Description: gets the percentage of change between year A (2010) and year B (2017) for all states*

- endpoint 2: `http://localhost:3000/api/v1/complaints/states?productId=payday_loan`
        *Description: gets complaints by product grouped by state*


## To-Do someday
    * API Documentation in Swagger
    * UI (probably React, possibly Vue...)
    * Proxy layer between UI and API to handle business logic
    * Init script that waits for DB and calls DB scripts
    * more unit tests.  Integration/E2E tests on UI.

**********
 ## Intro
 Hello and thank you for your interest in joining the Ombud team. We believe the best way to evaluate developers is with a coding challenge. For your project, we'd like you to complete as much of the following as you can. Please reach out to us if you get stuck and we'll help get you back on track.
 ## Project Description
 For this project we'd like you to build a server application that combines two different datasets and allows a client to answer questions against the combined data set through an API of your design.
 * Consumer Finance Complaints Database: https://www.consumerfinance.gov/data-research/consumer-complaints/ ([All Data csv](https://data.consumerfinance.gov/api/views/s6ew-h6mp/rows.csv?accessType=DOWNLOAD))
 * US Cities and Towns Dataset: https://www.census.gov/data/datasets/2017/demo/popest/total-cities-and-towns.html ([US-all csv](https://www2.census.gov/programs-surveys/popest/datasets/2010-2017/cities/totals/sub-est2017_all.csv))

#### Minimum Functionality:
* The server exposes an HTTP-based API onto the imported data.
* The API is designed such that it can be used - *not necessarily in a single request* - to answer these queries:
  - What product has the most complaints in the State of New York?
  - What is the aggregate population change between 2014 and 2015 in each state where Bank of America received a consumer complaint?
  - What is the fastest growing state that also has the most complaints for payday loans?
* The API is generalized enough to be able to answer other questions, i.e., we'd rather see a well-designed API than some endpoints that regurgitate answers to these specific questions.

#### Extended Functionality (Choose One):
* Implement a UI to enable exploration of the dataset via the API
* Combine with other datasets to answer more interesting questions
* Surprise us with an idea of your own!

## Requirements
* The server should be written in node.js
* The persistence engine is entirely at your discretion, but be prepared to justify your choice in the context of this project
* The development environment should be containerized using tools included in the standard Docker install.
* Any other tools / languages / scripts for data import and ancillary tasks are OK, but should be containerized so as not to assume local availability of the tools.
* All source code committed to the repository should be your own work - any external, runtime dependencies are OK
  - References to npm libraries in package.json are OK
  - References to Docker images in a docker-compose.yml are OK

## Criteria
 #### Does it work?
 The finished application should compile/run without errors and implement some or all of the functionality described above
 #### Code Quality
 Your code should be written with a consistent coding style, good organization, etc.
 #### Application Design
 Your app should have a logical api/data model that makes sense for the given problem and would be easy to extend for future use cases.
 ## Evaluation
 Let us know when you're finished. We'd like to be able to run this application with a single ```docker-compose up``` command, but please include any additional instructions for running locally.
 We'll review the app and invite you to the office to for a demo and code review session.
