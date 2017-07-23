const express = require('express');
const router = express.Router();
const bluebird = require('bluebird');
const nprSender = require('../nrp-sender-shim');
const redisConnection = require("../redis-connection");
const redis = require('redis');
const client = redis.createClient();
const flat = require('flat');
const unflatten = flat.unflatten;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

 
router.get('/:id', async (req, res) => {
    let message = {
        redis: redisConnection,
        eventName: 'api-people',
        data: {
            id: req.params.id
        },
        method: 'GET',
        expectsResponse: true
    }

    let response = await nprSender.sendMessage(message);
    console.log(response);

    
    if(response !== null) {
        res.send(response);
    } else {
        res.status(400).send({error: `Cannot find user with id: ${message.data.id}`});
    }
});

router.post('/', async (req, res) => {
    let message = {
        redis: redisConnection,
        eventName: 'api-people',
        data: {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            gender: req.body.gender,
            ip_address: req.body.ip_address,
        },
        method: 'POST',
        expectsResponse: true
    }

    let response = await nprSender.sendMessage(message);
    if(response !== null) {
        res.send(response);
    } else {
        res.status(400).send({error: `Cannot find user with id: ${message.data.id}`});
    }
});

router.put('/:id', async (req, res) => {
    let message = {
        redis: redisConnection,
        eventName: 'api-people',
        data: {
            id: req.params.id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            gender: req.body.gender,
            ip_address: req.body.ip_address,
        },
        method: 'PUT',
        expectsResponse: true
    }
    let response = await nprSender.sendMessage(message);

    if(response !== null) {
        res.send(response);
    } else {
        res.status(400).send({error: `Cannot find user with id: ${message.data.id}`});
    }
});

router.delete('/:id',  async (req, res) => {
        let message = {
        redis: redisConnection,
        eventName: 'api-people',
        data: {
            id: req.params.id,
        },
        method: 'DELETE',
        expectsResponse: true
    }

    let response = await nprSender.sendMessage(message);

    if(response !== null) {
        res.send(response);
    } else {
        res.status(400).send({error: `Cannot find user with id: ${message.data.id}`});
    }
});


module.exports = router;