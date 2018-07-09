
console.log("Hello Server");

// Dependencies

const express = require('express');
const morgan = require(`morgan`);

// Setup Dependencies

const app = express();

// Middleware
app.use(morgan(`common`));
app.use(express.static('public'));

// Routing

function authenticate(req, res, next) {
    console.log(`server approves`);
    res.status(200).send(`This works.`);
    next();
}


//app.use('/', authenticate);
    

// Open/Close Server

app.listen(process.env.PORT || 8080);

// Export App

module.exports = {app};