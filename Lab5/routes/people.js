const express = require('express');
const router = express.Router();
const data = require('../data/index.js');
const bluebird = require('bluebird');
const people = data.people;
const redis = require('redis');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


router.get('/history', (req, res) => {

    for(var i = 0; i < 20; i++) {
        var allPeople = [];
        client.get(i.toString, (err,person) => {
            if(err) {
                throw(err);
            }
            console.log(person);
            allPeople.push(person);
        });
    }

    res.send(allPeople);
    // res.send("Your are in the history route");
});

router.get('/:id', (req, res) => {
    client.get(req.params.id, (err, person) => {
        // if(typeof(person) === null) {
            people.getById(parseInt(req.params.id)).then((response) => {
                client.set(response.id.toString, response);
            });
        // }
    });
});

module.exports = router;