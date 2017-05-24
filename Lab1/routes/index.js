const taskRoutes = require('./tasks')

const constructorMethod = (app) => {
    app.use("/api/tasks", taskRoutes);

    app.use("*", (req, res) => {
        res.status(404).json({error: "This page does not exist"})
    });
}

module.exports = constructorMethod;

