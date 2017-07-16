const express = require('express');
const router = express.Router();
const data = require('../data/index.js');
const bluebird = require('bluebird');
const people = data.people;
const redis = require('redis');
const client = redis.createClient();
const flat = require('flat');
const unflatten = flat.unflatten;

let recentVisitors = [];
let recentHistory = [];

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


router.get('/history', async (req, res) => {
    console.log("RECENT VISITORS");
    console.log(recentVisitors);
    if(recentVisitors.length < 20) {
        for(let i = 0; i < recentVisitors.length; i++) {
            let recentPerson = await client.hgetallAsync(recentVisitors[i].toString());
            recentHistory.unshift(recentPerson);
        }
    } else {
        for(let i = 0; i < 20; i++) {
            let recentPerson = await client.hgetallAsync(recentVisitors[i].toString());
            recentHistory.unshift(recentPerson);
        }
    }
    res.send(recentHistory.reverse());
    recentHistory = [];
    // let m = client.multi();
    // client.keys("*", (err, allKeys) => {
    //     if(allKeys.length <= 20) {
    //         for(let i = 0; i < allKeys.length; i++){
    //             m.hgetallAsync(allKeys[i]);
    //         }
    //     }
    //     else {
    //         for(let i = 0; i < 20; i++) {
    //             m.hgetallAsync(allKeys[i]);
    //         }
    //     }
    //     m.exec((err, result) => {
    //         res.send(result);
    //     });
    // });
});

 
router.get('/:id', async (req, res) => {
    let person = await client.hgetallAsync(req.params.id.toString());
    let target = null
    console.log(typeof(person));
    if(person == null) {
        console.log("Im working here");
        try {
            target = await people.getById(parseInt(req.params.id));
            if(target) {
                let flatPerson = flat(target);
                let hmSetAsyncPerson = await client.hmsetAsync(target.id.toString(), flatPerson);
                recentVisitors.unshift(target.id.toString());
                res.json(target);
            }
        } catch(err) {
           res.send("Sorry, that person is not in the database")
        }
    } else {
        recentVisitors.unshift(person.id.toString());
        let unflattenedPerson = unflatten(person);
        res.send(unflattenedPerson);
    }
});

module.exports = router;