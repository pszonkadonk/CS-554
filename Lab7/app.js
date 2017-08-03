const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const socket = require('socket.io');
const bluebird = require('bluebird');
const nprSender = require('./public/js/nrp-sender-shim');
const redisConnection = require("./public/js/redis-connection");
const redis = require('redis');
const client = redis.createClient();
const flat = require('flat');
const unflatten = flat.unflatten;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


const staticFiles = express.static(__dirname + '/public');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(staticFiles);
app.use(express.static(__dirname + "/views"));

const configRoutes = require('./routes');

configRoutes(app)

const server = app.listen(3000, () => {
    console.log("Listening on port 3000....");
});

//Socket Setup

const io = socket(server); 


io.on('connection', (socket) => {
    console.log(`Made a socket connection to ${socket.id}`);

    socket.on('submitQuery', async (data) => {
        console.log(data);
        let message = {
            redis: redisConnection,
            eventName: 'search-pixabay',
            data: {
                criteria: data.query
            },
            method: 'GET',
            expectsResponse: true
        }
        let response = await nprSender.sendMessage(message);
        console.log("this is response back in socket.on:");
        console.log(response);

    });
});


