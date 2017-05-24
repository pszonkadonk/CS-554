const express = require('express');
const router = express.Router();
const data = require('../data/');
const taskData = data.tasks;


router.get('/', (req, res) => {
    res.send("Hello, Task World");
});

router.get('/:id', (req, res) => {
    taskData.getTaskById(req.params.id).then((task) => {
        res.json(task);
    });
});

router.post('/', (req, res) => {
    let taskInfo = req.body;

    if(!taskInfo) {
        res.status(400).json({error: "You must provide task data!"});
    }
    if(!taskInfo.title) {
        res.status(400).json({error: "You must provide task title!"});
    }
    if(!taskInfo.description) {
        res.status(400).json({error: "You must provide task description!"});
    }
    if(!taskInfo.hoursEstimated) {
        res.status(400).json({error: "You must provide task hours estimated!"});
    }
    if(!taskInfo.completed) {
        res.status(400).json({error: "You must provide if a task is completed!"});
    }
    if(!taskInfo.comments) {
        res.status(400).json({error: "You must provide task commencts!"});
    }

    taskData.addTask(taskInfo.title, taskInfo.description, 
                    taskInfo.hoursEstimated, taskInfo.completed,
                    taskInfo.comments).then((task) => {
                        res.json(task);
                    },(err) => {
                        res.status(500).send(err);
                    });
})

module.exports = router;