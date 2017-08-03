const redisConnection = require('./public/js/redis-connection');
const redis = require('redis');
const client = redis.createClient();
const bluebird = require('bluebird');
const flat = require('flat');
const request = require('request');
const unflatten = flat.unflatten;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


console.log("Worker started....");

function submitQuery(criteria) {
    return new Promise((resolve, reject) => {
        let url = `https://pixabay.com/api/?key=6062473-e1b87dcc78506a8d00bc7fab0&q=${criteria}&image_type=photo`
        // console.log("This is url:");
        // console.log(url);
        request({
            url: url,
            json: true
        }, (err, res, body) => {
            if(err) {
                console.log(err);
                reject(err);
            }
            if(!err && res.statusCode === 200) {
                resolve(body);
            }
        });
    });
}

redisConnection.on('search-pixabay:get:*', (message, channel) => {
    console.log("You have reached search pixabay worker");
    let requestId = message.requestId;
    let eventName = message.eventName;

    let criteria = message.data.criteria;
    
    let successEvent = `${eventName}:success:${requestId}`;
    let failedEvent = `${eventName}:failed:${requestId}`;

    let queryResult = submitQuery(criteria).then((result) => {
        console.log('Completed pixabay transaction');

        if(result === undefined) {
            let warning = 'Something went wrong';
            redisConnection.emit(failedEvent, {
                requestId: requestId,
                data: warning,
                eventName: eventName
            });
        } else {
            console.log(result)
            redisConnection.emit(successEvent, {
                requestId: requestId,
                data: result,
                eventName: eventName
            });
        }
    });
});







