var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database');

//connect database
mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connect to Mongoose Data');
});

//init app
var app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//set public folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.render('index');
});

//start the server
var port = 3000;
app.listen(port, function(){
    console.log('Server started on port '+ port);
});