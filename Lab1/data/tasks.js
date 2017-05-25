const mongoCollections = require('../config/mongoCollections');
const tasks = mongoCollections.tasks;
const uuid = require('uuid');

let exportedMethods = {

    getAllTasks() {
        return tasks().then((taskCollection) => {
            return taskCollection.find({}).toArray().then((taskList) => {
                if(taskList.length < 100) {
                    return taskList;
                } else {
                    return taskList.slice(0,100);
                }
            });
        });
    },
    getTaskById(id) {
        return tasks().then((taskCollection) => {
            return taskCollection.findOne({_id: id}).then((task) => {
                if(!task) {
                    throw "Could not find task with that id";
                }
                return task;
            })
        })
    },
    addTask(title, description, hoursEstimated, completed, comments) {
        return tasks().then((taskCollection) => {
            let newTask = {
                _id: uuid.v4(),
                title: title,
                description: description,
                hoursEstimated: hoursEstimated,
                completed: completed,
                comments: comments
            };

            return taskCollection.insertOne(newTask).then((newInsertedInfo) => {
                return newInsertedInfo.insertedId;
            }).then((newId) => {
                return this.find({_id: newId});
            });
        });
    },
    updateTask(id, updatedTask) {
        return tasks().then((taskCollection) => {
            let updatedTaskInfo = {
                title: updatedTask.title,
                description: updatedTask.description,
                hoursEstimated: updatedTask.hoursEstimated,
                completed: updatedTask.completed
            }
            let updateCommand = {
                $set: updatedTaskInfo
            };

            return taskCollection.updateOne({_id: id}, updateCommand).then(() => {
                return this.getTaskById(id);
            });
        });
    },
    addCommentToTask(id, newComment) {
        return tasks().then((taskCollection) => {
            let commentInfo = {
                _id: uuid.v4(),
                name: newComment.name,
                comment: newComment.comment
            };

            let updateCommand = {
                $push: {
                    comments: commentInfo
                }
            };

            taskCollection.updateOne({_id: id}, updateCommand).then(() => {
                return this.getTaskById(id);
            });
        });
    },
    removeCommentFromTask(taskId, commentId) {
        return tasks().then((taskCollection) => {
            let updateCommand = {
                $pull: {
                    "comments": {
                        _id: commentId
                    }
                }
            };
            return taskCollection.updateOne({_id: taskId}, updateCommand).then(() => {
                return this.getTaskById(taskId);
            });
        });
    }
}

module.exports = exportedMethods;