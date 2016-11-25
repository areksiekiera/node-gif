'use strict';

var express = require('express')
var app = express()

var gb = require('./gifbuilder')

app.get('/', function (req, res) {
	
	
	gb.build('welcome message', function(err, data){
		res.send('File created: ' + data['filename'] );
	})
	
  
})

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})

