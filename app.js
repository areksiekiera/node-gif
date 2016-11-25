'use strict';

var express = require('express')
var bodyParser = require('body-parser')

var app = express()
var gb = require('./gifbuilder')

app.use( bodyParser.json() );   

app.post('/make_gif', function (req, res) {
	
	// get message from post
	var message = req.param('message', false);

	// validate
	if ( !message || !message.trim().length )
		return res.status(400).send('Message missing!');

	gb.build(message, function(err, data){
		res.send('File created: ' + data['filename'] );
	})
	
  
})

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})

