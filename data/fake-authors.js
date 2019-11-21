var Author = require('../models/author');
var mongoose = require('mongoose');
var faker = require('faker');
var Config = require('../config/config');
const dotenv = require('dotenv');
const chalk = require('chalk');
var winston = require("winston");

var logger = new (winston.createLogger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'hackathon.log' })
    ]
});

dotenv.config({
    path: '.env'
});

"use strict";

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI, { useNewUrlParser: true, useUnifiedTopology: true  });
mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  logger.log('error','%s MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

products = [];
const howMany = 20;
var done=0;

for (var i=0; i < howMany; i++) {
    var fn = faker.name.firstName();
    var ln = faker.name.lastName();
    author = new Author({
        firstName: fn,
        lastName: ln
    });
    console.log(author.firstName);
    author.save(function(err,newuser) {
        if (err) {
            console.log('error: ',err.message);
        }
        console.log("New Author: " + newuser);
        done++;
        if (done>=howMany) {
            exit();
        }
    });
}

function exit() {
	mongoose.disconnect();
	exit;
}
