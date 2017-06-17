const contactRoutes = require("./contacts");

const constructorMethod = (app) => {
    app.use("/contacts", contactRoutes);

    app.get("/", (req, res) => {
        res.render("home", {});
    });

    app.use("*", (req, res) => {
        res.redirect("/");
    });
}

module.exports = constructorMethod;