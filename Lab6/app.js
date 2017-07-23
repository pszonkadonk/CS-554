const bluebird = require("bluebird");
const express = require('express');
const app = express();
const redis = require('redis');
const client = redis.createClient();
const bodyParser = require('body-parser');

app.use(bodyParser.json());


bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


const configRoutes = require('./routes');

app.use('/public', express.static(__dirname + "/public"));

configRoutes(app)

app.listen(3000, () => {
    console.log("Serving on port 3000...");
})