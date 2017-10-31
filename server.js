var express = require('express');
var app     = express();
var morgan  = require('morgan');
var mongoose= require('mongoose');
var bodyParser = require('body-parser');
var router     = express.Router();
var appRoute   = require('./app/routes/api')(router);
var path       = require('path');
var port    = process.env.PORT || 8080;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));
app.use('/api', appRoute);

var uri = 'mongodb://localhost:27017/togmoldb';
mongoose.connect(uri, { useMongoClient: true }, function(error) {
    if(error){
        console.log("Cannot connect to mongodb!");
    }else{
        console.log("Connection Successfully!");
    }
})

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname,'/public/app/views/index.html'));
})
app.listen(port, function(){
    console.log("Running server on port "+port)
});