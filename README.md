# Ombud Technical Test 2019
 ## Intro
 Hello and thank you for your interest in joining the Ombud team. We believe the best way to evaluate developers is with a coding challenge. For your project, we'd like you to complete as much of the following as you can. Please reach out to us if you get stuck and we'll help get you back on track.
 ## Project Description
 For this project we'd like you to build a server application that combines two different datasets and allows a client to answer questions against the combined data set through an API of your design.
 * Consumer Complaints Database: http://catalog.data.gov/dataset/consumer-complaint-database#topic=consumer_navigation
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
