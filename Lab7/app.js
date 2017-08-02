const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const staticFiles = express.static(__dirname + '/public');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



app.use(staticFiles);
app.use(express.static(__dirname + "/views"));

const configRoutes = require('./routes');

configRoutes(app)

app.listen(3000, () => {
    console.log("Listening on port 3000....");
})