# Page View Counter test app
This is just a useless test interview task.

[![Build Status](https://travis-ci.org/TheXardas/page-view-counter.svg?branch=master)](https://travis-ci.org/TheXardas/page-view-counter)

## About
It does one thing: shows **number of page views** for the past 1 minute. Check it out [here](http://page-view-counter-alb-2108592093.us-east-2.elb.amazonaws.com/)

It also shows **server instance** to check, if **load balancing** works.

There is a lot of devops stuff done in this task, which is not directly connected to it:

- Transpiling es6 code, tiniest build possible
- App is docker-containerized, keeping image size at minimum
- Can be built for both development and production usage with ease
- Integrated with Travis-CI for automatic building, testing and deploying to AWS.
- Built as load-balanced scalable micro-service.

## How to use
Run **tests** with:
```
npm install
npm run test
```

**Run app** in a dev-mode with:
```
npm install
npm start
```
And then open http://localhost:8080

Make sure, that you have **redis** server up and running locally, to start. Tests does not require redis, since connection is **mocked with sinon**.

To **build and run app in production mode** run:
```
npm install
npm run build
npm run serve
```
This will build app into the **dist** directory and run it.

If you don't want to pollute your system with any redis servers, you can just run with **docker-compose**:
```
docker-compose up
```
This will build app in production mode with deploying redis image.


To deploy a new version of an app to production, just make a push to master branch of this repo. But, hey, that is not allowed ;)


## How it works
App is a **nodejs web-server**, which increments page views in **redis** storage.

### Counter
**RedisMetrics** nodejs module stores keys in redis, **granulated by seconds**. This allows us to fetch page views, with precision to a **second**. Which is good enough for out task (last minute precision).

To store actual value of a counter, RedisMetrics uses **ZINCRBY** command, and then fetches key score with **ZSCORE**.

RedisMetrics's generated keys are **automatically expired**, so no need for any garbage collecting. Maximum number of keys stored is 600, which is good enough.

### ES6 code
ES6 code is automatically transpiled by **babel** during build and **babel-node** during dev run.

Babel is set up to be **node-version aware** by **"env"** preset, making it keep build as small as possible, leaving all unnecessary polyfills out of the boat.

It also minifies build files

### Docker
Application can be build as a container.

All docker instructions for page-view-counter microservice are located in **Dockerfile**.

It makes use of docker's [multistage-build feature](https://docs.docker.com/develop/develop-images/multistage-build/) to make sure, that only required stuff is inside final image, keeping it's size to a minimum.

Final image size is **~58MB**.

There is also a **docker-compose.yml** file, to build application with **redis** image to make it working right away.

### Continuous Integration
Application uses **Travis-CI** for building and deploying.

Build can be accessed [here](https://travis-ci.org/TheXardas/page-view-counter).

All sensitive data are secured with **travis encrypt** feature.

All CI-settings are **code-aware** by storing **.travis.yml** file in the root of the project.

### Amazon Web Services
App is deployed in **Amazon Web Services**, using **Elastic Container Service**. CI deploys image to AWS private docker container repository, and then triggers service update.

It is set up to be load-balanced, scalable and zero-time downtime microservice. **Application Load Balancer** is used.

App can be opened [here](http://page-view-counter-alb-2108592093.us-east-2.elb.amazonaws.com/)

**Instance** is written there to test load-balancer. If you try refreshing a bunch of times real quick, you'll see, that ALB changes instance used to serve request.

### TODO
It is just a test task, so there is **lots** of stuff to improve:

- Write more tests
- Make all stuff private (CI, AWS, Container repo, etc.)
- Create a more realistic architecture for a nodejs app, with routing.
- Create a ping-endpoint for amazon healthcheck service (it uses a root, thus incrementing page view count as a side-effect).
- Write own implementation of RedisMetrics's increment, so no need to import whole library in production app.
- Improve configuration system, to not store connection strings in a repo
- Set up monitoring, in case of deploy failure or production errors.