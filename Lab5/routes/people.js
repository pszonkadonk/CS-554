const express = require('express');
const router = express.Router();
const data = require('../data/index.js');
const bluebird = require('bluebird');
const people = data.people;
const redis = require('redis');
const client = redis.createClient();
const flat = require('flat');
const unflatten = flat.unflatten;


bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


router.get('/history', async (req, res) => {
    let recentlyVisited = [];
     client.keys("*", (err, allKeys) => {
         console.log(allKeys)
         client.mget(allKeys, redis.print);
      })
        .exec((err, replies) => {
            console.log("hello from exec");
            if(err) {
                console.log(err);
            }
            console.log(replies);
        });
});

 
router.get('/:id', async (req, res) => {
    let person = await client.hgetallAsync(req.params.id)
    let target = null
    console.log(typeof(person));
    if(person == null) {
        console.log("Im working here");
        try {
            target = await people.getById(parseInt(req.params.id));
            if(target) {
                let flatPerson = flat(target);
                let hmSetAsyncPerson = await client.hmsetAsync(target.id.toString(), flatPerson);
                client.ltrim(20);
                res.json(target);
            }
        } catch(err) {
           res.send("Sorry, that person is not in the database")
        }
    } else {
        let unflattenedPerson = unflatten(person);
        client.ltrim(20);
        res.send(unflattenedPerson);
    }
});

module.exports = router;