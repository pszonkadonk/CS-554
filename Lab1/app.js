const express = require('express');
const app = express();
const configRoutes = require('./routes');
const bodyParser = require('body-parser');
let requestMapping = {};  //mapping to keep track of requests

//middleware

app.use(bodyParser());
app.use(bodyParser.json());

const logRequestBody = (req, res, next) => {
    console.log("Request Body: ", req.body);
    console.log("Request Url: ", req.url);
    console.log("HTTP Verb: ", req.method);
    console.log("---------------")
    next();
};

const countRequests = (req, res, next) => {
    let requestUrl = req.url;
    if(requestMapping.hasOwnProperty(requestUrl)) {
        requestMapping[requestUrl] +=1
    } 
    else {
        requestMapping[requestUrl] = 1;
    }
    console.log("Request Log ", requestMapping);
    console.log();
    next();
};

app.use(logRequestBody);
app.use(countRequests);



configRoutes(app)

app.listen(3000, () => {
    console.log("Listening on port 3000");
});