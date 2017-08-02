const express = require('express');
const app = express();
const bodyParser = require('body-parser');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



app.use('/public', express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

const configRoutes = require('./routes');

configRoutes(app)

app.listen(3000, () => {
    console.log("Listening on port 3000....");
})