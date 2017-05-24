const mongoCollections = require('../config/mongoCollections');
const tasks = mongoCollections.tasks;
const uuid = require('uuid');

let exportedMethods = {

    getAllTasks() {
        return tasks().then((taskCollection) => {
            return taskCollection.find({}).toArray();
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
    }
}

module.exports = exportedMethods;