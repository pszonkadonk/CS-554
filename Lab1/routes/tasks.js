const express = require('express');
const router = express.Router();
const data = require('../data/');
const taskData = data.tasks;


router.get('/', (req, res) => {
    taskData.getAllTasks().then((taskList) => {
        res.send(taskList);
    })
});

router.get('/:id', (req, res) => {
    taskData.getTaskById(req.params.id).then((task) => {
        res.json(task);
    }).catch(() => {
        res.status(500).json({error: "Resource not found"})
    });
});

router.post('/', (req, res) => {
    let taskInfo = req.body;

    if(!taskInfo) {
        res.status(400).json({error: "You must provide task data!"});
        return;
    }
    if(!taskInfo.title) {
        res.status(400).json({error: "You must provide task title!"});
        return;
    }
    if(!taskInfo.description) {
        res.status(400).json({error: "You must provide task description!"});
        return;
    }
    if(!taskInfo.hoursEstimated) {
        res.status(400).json({error: "You must provide task hours estimated!"});
        return;
    }
    if(!taskInfo.completed) {
        res.status(400).json({error: "You must provide if a task is completed!"});
        return;
    }
    if(!taskInfo.comments) {
        res.status(400).json({error: "You must provide task comments!"});
        return;
    }

    taskData.addTask(taskInfo.title, taskInfo.description, 
                    taskInfo.hoursEstimated, taskInfo.completed,
                    taskInfo.comments).then((task) => {
                        res.json(task);
                    },(err) => {
                        res.status(500).send(err);
                    });
})

router.put('/:id', (req, res) => {
    let taskInfo = req.body;

    if(!taskInfo) {
        res.status(400).json({error: "Must provide task info"});
    }
    if(!taskInfo.title) {
        res.status(400).json({error: "You must provide task title!"});
        return;
    }
    if(!taskInfo.description) {
        res.status(400).json({error: "You must provide task description!"});
        return;
    }
    if(!taskInfo.hoursEstimated) {
        res.status(400).json({error: "You must provide task hours estimated!"});
        return;
    }
    if(!taskInfo.completed) {
        res.status(400).json({error: "You must provide if a task is completed!"});
        return;
    }
    if(taskInfo.comments) {
        res.status(400).json({error: "Sorry, you cannot update comments"});
        return;
    }

    taskData.updateTask(req.params.id, taskInfo).then((updatedTask) => {
        res.json(updatedTask);
    }, (err) => {
        res.sendStatus(500).json({error: err});
    }).catch(() => {
        res.status(404).json({error: "Task not found"});
    });
});

router.patch('/:id', (req, res) => {
    let taskInfo = req.body;

    if(!taskInfo) {
        res.status(400).json({error: "Must provide update data"});
    }

    if(taskInfo.comments) {
        res.status(400).json({error: "Cannot update comments in this manner"});
    }

    taskData.updateTaskPartial(req.params.id, taskInfo).then((updatedTask) => {
        res.json(updatedTask);
    }, (err) => {
        res.status(500).json({error: err});
    }).catch(() => {
        res.status(404).json({error: "Task not found"});
    });
});

router.post('/:id/comments', (req, res) => {
    let targetTaskId = req.params.id;
    let newComment = req.body;
    if(!newComment) {
        res.status(400).json({error: "Must provide new comment"});
    }
    if(!newComment.name) {
        res.status(400).json({error: "Must provide a name for comment"});
    }
    if(!newComment.comment) {
        res.status(400).json({error: "Must provide a comment with your submission"});
    }

    taskData.addCommentToTask(targetTaskId, newComment).then((task) => {
        res.json(task);
    }).catch(() => {
        res.status(404).json({error: "Task not found"});
    });
});

router.delete('/:taskId/:commentId', (req, res) => {
    let taskId = req.params.taskId;
    let commentId = req.params.commentId;

    taskData.removeCommentFromTask(taskId, commentId).then((task) => {
        res.json(task);
    }, (err) => {
        res.sendStatus(500).json({error: err})
    }).catch(() => {
        res.status(404).json({error: "Resource not found"});
    });
})

module.exports = router;