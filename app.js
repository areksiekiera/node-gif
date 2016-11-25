'use strict';

var express = require('express')
var bodyParser = require('body-parser')

var app = express()
var gb = require('./gifbuilder')

app.use( bodyParser.json() );   
app.set('json spaces', 40);

app.post('/make_gif', function (req, res) {
	
	// get message from post
	var message = req.param('message', false);

	// validate
	if ( !message || !message.trim().length )
		return res.status(400).send('Message missing!');

	try{
		gb.build(message, function(err, data){
			res.json({ "uri": data['uri'] });
		})
	}
	catch(err){
		console.log(err);
		return res.status(500).send('Server error');
	}
	
  
})

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})

