
console.log("Hello Server");

// Dependencies

const express = require('express');

// Setup Dependencies

const app = express();

// Middleware

app.use(express.static('public'));

// Routing

// Open/Close Server

app.listen(process.env.PORT || 8080);

// Export App

module.exports = {app};