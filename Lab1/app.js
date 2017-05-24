const express = require('express');
const app = express();
const configRoutes = require('./routes');
const bodyParser = require('body-parser');


//middleware

app.use(bodyParser());
app.use(bodyParser.json());




configRoutes(app)

app.listen(3000, () => {
    console.log("Listening on port 3000");
});