const express = require('express');
const app = express();
const static = express.static(__dirname + "/public")


app.use(static);

app.get('/', (req, res) => {
    res.send("index")
});

app.get("*", (req, res) => {
    res.status(404).send("Sorry, that page does not exist");
});


app.listen(3000, () => {
    console.log("Listening on port 3000...");
});