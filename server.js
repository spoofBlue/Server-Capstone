
console.log("Hello Server");

// Dependencies

const express = require('express');
const morgan = require(`morgan`);
const mongoose = require(`mongoose`);

const entryRouter = require(`./entryRouter`);
const userRouter = require(`./userRouter`);
const {DATABASE_URL, PORT, TEST_DATABASE_URL} = require(`./config.js`);

// Setup Dependencies

const app = express();

//mongoose.Promise = global.promise;

// Middleware
app.use(morgan(`common`));
app.use(express.static('public'));

function authenticate(req, res, next) {
    console.log(`server approves`);
    res.status(200).send(`This works.`);
    next();
}


//app.use('/', authenticate);


// Routing

app.use(`/entries`, entryRouter);

app.use(`/users`, userRouter);
    

// Open/Close Server

let server;

function runServer(database_url, port=PORT) {  //database and port connection through config.js
    return new Promise((resolve, reject) => {
        mongoose.connect(database_url, function(error) {
            if (error) {
                console.log(`mongoose failed to connect`);
                return(reject(error));
            }
            server = app.listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve();
            })
            .on('error', err => {
                mongoose.disconnect();
                console.log("error in runServer, failed to listen at server.");
                reject(err);
            });
        });
    });
}

function closeServer() {
    return mongoose.disconnect()
    .then(() => {
        return new Promise((resolve, reject) => {
            console.log(`closing server`);
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
};

// Export App

module.exports = {app, runServer, closeServer};