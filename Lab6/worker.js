const redisConnection = require('./redis-connection');
const request = require("request");
const redis = require('redis');
const client = redis.createClient();
const bluebird = require('bluebird');
const flat = require('flat');
const unflatten = flat.unflatten;
const uuid = require("node-uuid");



bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);



const url = "http://gist.githubusercontent.com/philbarresi/5cf15393d245b38a2d86ce8207d5076c/raw/d529fb474c1af347702ca4d7b992256237fa2819/lab5.json";

//get data
request({
    url: url,
    json: true
}, (err, res, body) => {
    if(!err && res.statusCode === 200) {
        body.forEach((person) => {
            let flattenedPerson = flat(person);
            client.hmset(person.id.toString(), flattenedPerson);
        });
        console.log("downloaded person data.");
    }
});

function getPersonById(id) {
    return new Promise((resolve, reject) => {
        client.hgetallAsync(id).then((result) => {
            console.log(result);
            if(result !== null) {
                resolve(result);
            } else {
                return Promise.reject(new Error("This user does not exist"));
            }
        }).catch((e) => {
            reject(e);
        });
    }).catch((e) => {
        Promise.reject(e);
    });
}


function addPerson(person) {
    return new Promise((resolve, reject) => {
        let newId = uuid.v4();
        person.id = newId;
        let flattenedPerson = flat(person);
        client.hmsetAsync(person.id, flattenedPerson).then((newData) => {
            client.hgetallAsync(person.id).then((result) => {
                console.log("Completed transaction to create new user: ");
                console.log(result);
                resolve(result);
            });
        });
    });
}

function updatePerson(oldPerson, newPerson) {
    return new Promise((resolve, reject) => {
        let updatedPerson = Object.assign({}, oldPerson, newPerson);
        let flattenedPerson = flat(updatedPerson);
        client.hmsetAsync(updatedPerson.id, flattenedPerson).then((response) => {
            client.hgetallAsync(updatedPerson.id).then((result) => {
                console.log("Completed transaction to update user: ");
                console.log(result);
                resolve(result);
            });
        });
    });
}

function deletePerson(id) {
    return new Promise((resolve, reject) => {
        client.del(id, (err, response) => {
            if(response === 0) {
                Promise.reject("user does not exist");
            }
            resolve(response);
        });
    });
}


redisConnection.on('api-people:get:*', (message, channel) => {

    let requestId = message.requestId;
    let eventName = message.eventName;

    let targetPerson = message.data.id;
    let successEvent = `${eventName}:success:${requestId}`;
    let failedEvent = `${eventName}:failed:${requestId}`;

    let peep = getPersonById(targetPerson).then((result) => {
        console.log(`Completing transaction to get user with id ${targetPerson}`);
        console.log(result);

        if(result === undefined) {
            let warning = "This user does not exist";
            redisConnection.emit(failedEvent, {
                requestId: requestId,
                data: warning,
                eventName: eventName
            });
        } else {
            console.log("I should be sending the person back");
            redisConnection.emit(successEvent, {
                requestId: requestId,
                data: result,
                eventName: eventName
            });
        }
    });
});

redisConnection.on('api-people:post:*', (message, channel) => {
    let requestId = message.requestId;
    let eventName = message.eventName;

    let successEvent = `${eventName}:success:${requestId}`;

    let newPerson = addPerson(message.data).then((result) => {
        redisConnection.emit(successEvent, {
            requestId: requestId,
            data: result,
            eventName: eventName
        });
    });
});

redisConnection.on('api-people:put:*', (message, channel) => {
    let requestId = message.requestId;
    let eventName = message.eventName;

    let successEvent = `${eventName}:success:${requestId}`;
    let failedEvent = `${eventName}:failed:${requestId}`;

    let newPerson = getPersonById(message.data.id).then((person) => {
        console.log(person);
        if(person !== undefined) {
            updatePerson(person, message.data).then((result) => {
            });
        } else {
            let warning = "This user does not exist";
                redisConnection.emit(failedEvent, {
                    requestId: requestId,
                    data: warning,
                    eventName: eventName
                });
        }

    });
});

redisConnection.on('api-people:delete:*', (message, channel) => {
    let requestId = message.requestId;
    let eventName = message.eventName;

    let successEvent = `${eventName}:success:${requestId}`;
    let failedEvent = `${eventName}:failed:${requestId}`;

    let newPerson = deletePerson(message.data.id).then((result) => {
        if(result === 0) {
            redisConnection.emit(failedEvent, {
                requestId: requestId,
                data: `User ${message.data.id} does not exist`,
                eventName: eventName
            });
        } else {
            redisConnection.emit(failedEvent, {
                requestId: requestId,
                data: `User ${message.data.id} deleted`,
                eventName: eventName
            });  
        }
    });
});







