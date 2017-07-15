const peopleRoutes = require("./people")

const constructorMethod = (app) => {
    app.use("/api/people", peopleRoutes);

    app.use("*", (req, res) => {
        res.redirect("/");
    });
};

module.exports = constructorMethod;