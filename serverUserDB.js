const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const validator = require('express-validator');

var app = express();

var router = require('./services/router');

if(process.env.NODE_ENV == 'production'){
	mongoose.connect(process.env.MONGO_URL)
} else{
	mongoose.connect('mongodb://xxxx@dsxxxxx.mlab.com:xxxxx/xxxxxx');
}

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());
app.use('/api', router);

app.listen(3030, function(){
	console.log('Express started on port 3030.');
});