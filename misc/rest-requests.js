/**
 * Created by Thomas on 20.05.2015.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/register', function (req, res) {
    var regId = req.body.regId;

    if (undefined === regId) {
        res.json({status: "BAD", msg: "No regId-parameter given"});
    } else {
        res.json({status: "OK", msg: "Your regId: "+regId});
    }
});

app.get('/', function (req, res) {
    console.log(req.body.asdf, req.asdf, req.param("asdf"), req.query.asdf);
    res.send('Hello World!');
});

// Start Server on Port 80
app.listen(3001);