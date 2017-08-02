const routes = require("./routes")

const constructorMethod = (app) => {
    app.use("/", routes);

    app.use("*", (req, res) => {
        res.redirect("/");
    });
};

module.exports = constructorMethod;