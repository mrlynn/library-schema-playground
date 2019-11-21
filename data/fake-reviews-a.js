var Author = require('../models/author');
var User = require('../models/user');
var Book = require('../models/book');
var Review = require('../models/review');
var mongoose = require('mongoose');
var faker = require('faker');
var Config = require('../config/config');
const dotenv = require('dotenv');
const chalk = require('chalk');
var winston = require("winston");

var logger = new (winston.createLogger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: process.env.title + '.log' })
    ]
});

dotenv.config({
	path: '.env'
});

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
mongoose.connection.on('error', () => {
	console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
	logger.log('error', '%s MongoDB connection error. Please make sure MongoDB is running.');
	process.exit();
});
const howMany = 20;
var done = 0;
Book.countDocuments().exec(function (err, count) {
    var randomBook = Math.floor(Math.random() * count)
    // Again query all users but only fetch one offset by our random #
    Book.findOne().skip(randomBook).exec(function (err,book) {
        if (err) {
            console.log("Error " + err.message);
            exit();
        }
        if (done >= howMany) {
            exit();
        }
        done++;
        console.log("Making review #" + done);
        User.countDocuments().exec(function (err, count) {
            // Get a random entry
            var random = Math.floor(Math.random() * count)
            // Again query all users but only fetch one offset by our random #
            User.findOne().skip(random).exec(
                function (err, user) {
                    if (err) {
                        console.log('error: ' + err.message);
                    }
                    review = new Review({
                        user: user._id,
                        book: book._id,
                        rating: faker.random.number(5),
                        text: faker.lorem.sentence(),
                        created_at: Date.now()
                    })
                    review.save(function(err,newreview) {
                        if (err) {
                            console.log("Error: " + err.message);f
                        }
                        console.log("New Review" + JSON.stringify(newreview));
                    });
                }
            );
        });
    })
})
