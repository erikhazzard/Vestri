# Vestri
![Vestri](http://media-cache-ec0.pinimg.com/originals/dd/6e/98/dd6e9828558dfe96a8f1468cdbf23102.jpg)

Vestri provides a bootstrap project for modern websites. It provides a simple backend structure using NodeJS, Express, and Mongo. Gulp, Sass, and Browserify are provided for the front end work flow. 

# Setup
1. Run `npm install` to install all project dependencies

# Configuration
You'll want to change some configuration options for your own app:

1. MongoDB Database Name. Set in conf/environment/*.json. Specify the name / location of the DB in the environment configuration variables

# Components
## Base building blocks - Backend
* Express.js
* Rabbitmq
* Websockets
* Redis

## Base building blocks - Frontend
*Gulp* is used to manage building files. To run, run `make gulp`, which runs `gulp watch` but runs it in a loop in case an error occurs which would normally crash gulp (in this case, it just restarts gulp, so you don't have to keep restarting gulp manually everytime a syntax error occurs)

* Webpack is used for building JS

### CSS
* SASS
* Bourbon 

### JavaScript
* Browserify
* Bragi logger
* Backbone.js
* EventEmitter
* Jquery
* Lodash
* ReactJS 
* Fluxxor
