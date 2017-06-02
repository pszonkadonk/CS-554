const express = require('express');
const app = express();



app.use(express.static('public'));




app.get('/', (req,res) => {
    res.send('index');
});

app.get('*', (req,res) => {
    res.status(404).send('404 Page Not Found');
});

app.listen(3000, (req,res) => {
    console.log("Listening on port 3000...");
});